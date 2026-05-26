package com.internship.studenttaskmanager.service;

import com.internship.studenttaskmanager.dto.LoginRequestDTO;
import com.internship.studenttaskmanager.dto.RegisterRequestDTO;
import com.internship.studenttaskmanager.dto.UserResponseDTO;
import com.internship.studenttaskmanager.exception.BadRequestException;
import com.internship.studenttaskmanager.exception.DuplicateResourceException;
import com.internship.studenttaskmanager.exception.ResourceNotFoundException;
import com.internship.studenttaskmanager.model.User;
import com.internship.studenttaskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDTO registerUser(RegisterRequestDTO dto) {
        Optional<User> existing = userRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new DuplicateResourceException("Email already registered");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User saved = userRepository.save(user);
        return new UserResponseDTO(saved.getId(), saved.getName(), saved.getEmail());
    }

    public UserResponseDTO loginUser(LoginRequestDTO dto) {
        Optional<User> user = userRepository.findByEmail(dto.getEmail());
        if (user.isEmpty() || !passwordEncoder.matches(dto.getPassword(), user.get().getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }
        User u = user.get();
        return new UserResponseDTO(u.getId(), u.getName(), u.getEmail());
    }
}