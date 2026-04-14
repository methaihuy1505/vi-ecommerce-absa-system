package com.example.vi_ecommerce_absa_system.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long userId;
    private Long productId;
    private String comment;
}