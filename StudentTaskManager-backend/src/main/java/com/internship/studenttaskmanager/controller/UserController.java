package com.internship.studenttaskmanager.controller;

import java.time.Instant;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.internship.studenttaskmanager.dto.ApiResponse;
import com.internship.studenttaskmanager.dto.LoginRequestDTO;
import com.internship.studenttaskmanager.dto.RegisterRequestDTO;
import com.internship.studenttaskmanager.dto.UserResponseDTO;
import com.internship.studenttaskmanager.exception.BadRequestException;
import com.internship.studenttaskmanager.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private com.internship.studenttaskmanager.service.RefreshTokenService refreshTokenService;

    @Autowired
    private com.internship.studenttaskmanager.repository.RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO dto) {
        UserResponseDTO user = userService.registerUser(dto);
        return ResponseEntity.ok(
                ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<com.internship.studenttaskmanager.dto.LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletResponse respHttp) {
        try {
            com.internship.studenttaskmanager.dto.LoginResponseDTO resp = userService.authenticate(dto);
            // create refresh token and set HttpOnly cookie
            Optional<com.internship.studenttaskmanager.model.User> uOpt = userService.findByEmail(dto.getEmail());
            if (uOpt.isPresent()) {
                com.internship.studenttaskmanager.model.User u = uOpt.get();
                com.internship.studenttaskmanager.model.RefreshToken rt = refreshTokenService.createRefreshToken(u);
                Cookie cookie = new Cookie("refreshToken", rt.getToken());
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                // set cookie expiry in seconds
                long secs = rt.getExpiryDate().getEpochSecond() - Instant.now().getEpochSecond();
                cookie.setMaxAge((int) Math.max(0, secs));
                // In production consider Secure flag and SameSite
                // add cookie to response (use injected response to avoid RequestContextHolder issues)
                if (respHttp != null) {
                    respHttp.addCookie(cookie);
                }
            }

            return ResponseEntity.ok(ApiResponse.success("Login successful", resp));
        } catch (BadRequestException ex) {
            // authentication failure - do not log stacktrace
            logger.warn("Authentication failed for email={}", dto.getEmail());
            return ResponseEntity.status(400).body(ApiResponse.error("Invalid email or password"));
        } catch (Exception ex) {
            logger.error("Login failed", ex);
            return ResponseEntity.status(500).body(ApiResponse.error("Login failed"));
        }

    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<java.util.Map<String, String>>> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("No refresh token"));
        }
        Optional<com.internship.studenttaskmanager.model.RefreshToken> rtOpt = refreshTokenRepository.findByToken(refreshToken);
        if (rtOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid refresh token"));
        }
        com.internship.studenttaskmanager.model.RefreshToken rt = rtOpt.get();
        if (rt.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenService.removeToken(rt);
            return ResponseEntity.status(401).body(ApiResponse.error("Refresh token expired"));
        }
        String newAccess = userService.generateTokenForEmail(rt.getUser().getEmail());
        java.util.Map<String, String> m = new java.util.HashMap<>();
        m.put("token", newAccess);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", m));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse respHttp) {
        if (refreshToken != null) {
            Optional<com.internship.studenttaskmanager.model.RefreshToken> rtOpt = refreshTokenRepository.findByToken(refreshToken);
            rtOpt.ifPresent(refreshTokenService::removeToken);
        }
        // clear cookie by setting empty and maxAge=0
        if (respHttp != null) {
            Cookie cookie = new Cookie("refreshToken", "");
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            respHttp.addCookie(cookie);
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out", ""));
    }
}
