package com.example.vi_ecommerce_absa_system.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String fullName; // Tên người bình luận
    private Long productId;
    private String comment;
    private String aiResult; // Dữ liệu JSON ({"PRICE_Negative": 80.5...})
    private LocalDateTime createdAt;
}