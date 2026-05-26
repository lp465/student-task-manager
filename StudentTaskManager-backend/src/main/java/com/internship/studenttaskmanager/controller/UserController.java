package com.internship.studenttaskmanager.controller;

import com.internship.studenttaskmanager.dto.ApiResponse;
import com.internship.studenttaskmanager.dto.LoginRequestDTO;
import com.internship.studenttaskmanager.dto.RegisterRequestDTO;
import com.internship.studenttaskmanager.dto.UserResponseDTO;
import com.internship.studenttaskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO dto) {
        UserResponseDTO user = userService.registerUser(dto);
        return ResponseEntity.ok(
                ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO dto) {
        UserResponseDTO user = userService.loginUser(dto);
        return ResponseEntity.ok(
                ApiResponse.success("Login successful", user));
    }
}