package com.example.vi_ecommerce_absa_system.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AiResponse {
    private String original_comment;
    private Map<String, Double> predictions;
}