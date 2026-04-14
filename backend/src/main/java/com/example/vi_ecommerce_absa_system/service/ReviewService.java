package com.example.vi_ecommerce_absa_system.service;

import com.example.vi_ecommerce_absa_system.dto.AiResponse;
import com.example.vi_ecommerce_absa_system.dto.ReviewRequest;
import com.example.vi_ecommerce_absa_system.dto.ReviewResponse;
import com.example.vi_ecommerce_absa_system.entity.Product;
import com.example.vi_ecommerce_absa_system.entity.Review;
import com.example.vi_ecommerce_absa_system.entity.User;
import com.example.vi_ecommerce_absa_system.repository.ProductRepository;
import com.example.vi_ecommerce_absa_system.repository.ReviewRepository;
import com.example.vi_ecommerce_absa_system.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public ReviewResponse addReviewAndAnalyze(ReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        // 1. Gọi sang AI Microservice (Python)
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> aiRequest = Map.of("comment", request.getComment());
        String aiResultJson = "{}";

        try {
            AiResponse aiResponse = restTemplate.postForObject(aiServiceUrl, aiRequest, AiResponse.class);
            if (aiResponse != null && aiResponse.getPredictions() != null) {
                // Chuyển Map predictions thành chuỗi JSON để lưu MySQL
                ObjectMapper mapper = new ObjectMapper();
                aiResultJson = mapper.writeValueAsString(aiResponse.getPredictions());
            }
        } catch (Exception e) {
            System.err.println("Lỗi gọi AI Service: Mất kết nối tới Python API. Lưu kết quả rỗng.");
        }

        // 2. Lưu xuống Database
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setComment(request.getComment());
        review.setAiResult(aiResultJson);
        Review savedReview = reviewRepository.save(review);

        // 3. Trả kết quả sạch ra ngoài
        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Hàm phụ trợ map Entity -> DTO
    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .fullName(review.getUser().getFullName())
                .productId(review.getProduct().getId())
                .comment(review.getComment())
                .aiResult(review.getAiResult())
                .createdAt(review.getCreatedAt())
                .build();
    }
}