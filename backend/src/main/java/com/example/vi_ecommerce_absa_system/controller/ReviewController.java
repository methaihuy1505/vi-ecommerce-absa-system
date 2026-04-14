package com.example.vi_ecommerce_absa_system.controller;

import com.example.vi_ecommerce_absa_system.dto.ReviewRequest;
import com.example.vi_ecommerce_absa_system.dto.ReviewResponse;
import com.example.vi_ecommerce_absa_system.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API dành cho User gửi bình luận
    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest request) {
        try {
            ReviewResponse response = reviewService.addReviewAndAnalyze(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API dành cho Admin Dashboard tải danh sách bình luận (có kèm AI JSON)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }
}