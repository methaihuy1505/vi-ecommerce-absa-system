package com.example.vi_ecommerce_absa_system.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private String message;
}