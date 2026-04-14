package com.example.vi_ecommerce_absa_system.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String fullName; // Chỉ dùng khi đăng ký
}