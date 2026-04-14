package com.example.vi_ecommerce_absa_system.service;

import com.example.vi_ecommerce_absa_system.dto.AuthRequest;
import com.example.vi_ecommerce_absa_system.dto.AuthResponse;
import com.example.vi_ecommerce_absa_system.entity.User;
import com.example.vi_ecommerce_absa_system.repository.UserRepository;
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

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        // Hash password trước khi lưu xuống DB
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole("USER"); // Mặc định là user thường

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .message("Đăng ký thành công!")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // So sánh password dạng text (người dùng nhập) với password đã hash trong DB
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return AuthResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .message("Đăng nhập thành công!")
                        .build();
            }
        }
        throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu!");
    }
}