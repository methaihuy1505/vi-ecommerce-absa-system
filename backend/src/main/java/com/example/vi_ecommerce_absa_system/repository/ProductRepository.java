package com.example.vi_ecommerce_absa_system.repository;

import com.example.vi_ecommerce_absa_system.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}