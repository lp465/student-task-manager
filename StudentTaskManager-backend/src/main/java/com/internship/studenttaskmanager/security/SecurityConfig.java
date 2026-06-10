package com.internship.studenttaskmanager.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtUtils jwtUtils;

    public SecurityConfig(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtils);

        http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/register", "/api/users/login", "/actuator/**").permitAll()
                .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(@Value("${frontend.origins:http://localhost:5173,http://localhost:5174,http://localhost:5175}") String frontendOrigins,
            @Value("${frontend.production.origin:}") String frontendProduction) {
        CorsConfiguration configuration = new CorsConfiguration();
        // support comma-separated origins and localhost wildcard pattern for dev
        // prefer explicit origins for production via frontend.production.origin
        if (frontendProduction != null && !frontendProduction.isBlank()) {
            configuration.setAllowedOriginPatterns(List.of(frontendProduction));
        } else {
            String[] parts = frontendOrigins.split(",");
            for (int i = 0; i < parts.length; i++) {
                parts[i] = parts[i].trim();
            }
            // allow localhost any port as fallback
            List<String> patterns = new java.util.ArrayList<>(List.of(parts));
            patterns.add("http://localhost:*");
            configuration.setAllowedOriginPatterns(patterns);
        }
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
