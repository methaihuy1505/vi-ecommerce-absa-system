# Vi-Ecommerce - Hệ Thống Thương Mại Điện Tử Tích Hợp AI Phân Tích Cảm Xúc (ABSA)

Ứng dụng **Vi-Ecommerce** là một hệ thống quản lý bán hàng công nghệ tích hợp trí tuệ nhân tạo (AI) để phân tích phản hồi người dùng một cách chuyên sâu. Thay vì sử dụng hệ thống đánh giá 5 sao tổng thể mang tính chung chung, dự án tập trung giải quyết bài toán cốt lõi: Phân tích khách hàng đang khen hay chê ở khía cạnh cụ thể nào của sản phẩm.

---

## Tính năng nổi bật

### 1. Trải nghiệm Khách hàng thông minh
- **Nhận diện cảm xúc đa khía cạnh:** Hệ thống cung cấp cái nhìn trực quan về chất lượng sản phẩm thông qua các nhãn cảm xúc được AI bóc tách từ hàng loạt bình luận cũ (ví dụ: màn hình đẹp, pin yếu, giá đắt). 
- **Tiết kiệm thời gian:** Khách hàng không cần đọc từng bình luận mà vẫn nắm bắt được ưu/nhược điểm thực tế của thiết bị.

### 2. Quản trị Doanh nghiệp (Admin Insight)
- **Dashboard phân tích:** Cung cấp Bảng điều khiển thông minh tự động tổng hợp số liệu đa khía cạnh.
- **Tự động đề xuất:** AI chỉ ra những tiêu chí đang bị phàn nàn nhiều nhất để đưa ra "Gợi ý chiến lược cải thiện" trực tiếp cho doanh nghiệp.

---

## Công nghệ sử dụng & Kiến trúc Microservices

Hệ thống tuân thủ kiến trúc **Microservices** hiện đại, phân tách rõ ràng trách nhiệm của từng thành phần để dễ dàng mở rộng và bảo trì:

### 1. Tầng Trí tuệ nhân tạo (AI Service)
- **Ngôn ngữ & Framework:** Python 3.11, FastAPI, Uvicorn.
- **Thư viện AI/ML:** Scikit-learn (Machine Learning), Underthesea (Xử lý ngôn ngữ tự nhiên Tiếng Việt).
- **Cơ chế:** Đóng gói mô hình `.pkl`, triển khai Web Service độc lập trả về JSON. Tích hợp thuật toán "Smart Filter" (Bộ lọc thông minh) xử lý các nhãn xung đột.

### 2. Tầng Xử lý nghiệp vụ (Backend)
- **Ngôn ngữ & Framework:** Java 21, Spring Boot.
- **Cơ sở dữ liệu:** MySQL 9.0.2, Spring Data JPA.
- **Cơ chế:** Đóng vai trò điều phối, gửi nội dung văn bản sang AI Service qua giao thức HTTP, lưu trữ đồng bộ bình luận và nhãn cảm xúc vào CSDL.

### 3. Tầng Giao diện người dùng (Frontend)
- **Công nghệ:** ReactJS, Vite.
- **Giao diện:** Trực quan hóa dữ liệu qua biểu đồ tỷ lệ phần trăm và thẻ tag màu sắc.

### 4. Triển khai (Deployment)
- Docker, Render Cloud, Railway.

---

## Mô hình AI (Aspect-Based Sentiment Analysis)

Mô hình học máy được định nghĩa qua ba thành phần chính (T, P, E):

- **Experience (E) - Dữ liệu huấn luyện:** Kế thừa bộ dữ liệu benchmark **UIT-ViSFD** (Đại học CNTT - ĐHQG HCM, KSEM 2021) với 11.122 bình luận thực tế, 10 khía cạnh cốt lõi và 3 thái độ.
- **Task (T) - Nhiệm vụ:** Multi-label Classification (Phân loại đa nhãn) giải quyết hiện tượng "Thái độ hỗn hợp" (Mixed Polarity).
- **Performance (P) - Hiệu suất:** Đạt độ chính xác tổng hợp (Micro/Weighted Avg F1-Score) **0.71 (71%)**. 

<details>
<summary><b> Nhấn vào đây để xem Báo cáo Hiệu suất Chi tiết (Classification Report)</b></summary>

| Khía cạnh & Thái độ | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| **BATTERY_Negative** | 0.75 | 0.79 | 0.77 | 368 |
| **BATTERY_Neutral** | 0.25 | 0.32 | 0.28 | 92 |
| **BATTERY_Positive** | 0.81 | 0.84 | 0.83 | 554 |
| **CAMERA_Negative** | 0.65 | 0.72 | 0.68 | 171 |
| **CAMERA_Neutral** | 0.41 | 0.48 | 0.44 | 71 |
| **CAMERA_Positive** | 0.75 | 0.84 | 0.79 | 346 |
| **DESIGN_Negative** | 0.51 | 0.36 | 0.43 | 96 |
| **DESIGN_Neutral** | 0.25 | 0.07 | 0.11 | 28 |
| **DESIGN_Positive** | 0.74 | 0.78 | 0.76 | 274 |
| **FEATURES_Negative** | 0.66 | 0.82 | 0.73 | 459 |
| **FEATURES_Neutral** | 0.20 | 0.19 | 0.20 | 52 |
| **FEATURES_Positive** | 0.54 | 0.66 | 0.59 | 200 |
| **GENERAL_Negative** | 0.60 | 0.73 | 0.66 | 294 |
| **GENERAL_Neutral** | 0.38 | 0.36 | 0.37 | 83 |
| **GENERAL_Positive** | 0.84 | 0.81 | 0.83 | 1004 |
| **PERFORMANCE_Negative** | 0.66 | 0.77 | 0.71 | 454 |
| **PERFORMANCE_Neutral** | 0.34 | 0.34 | 0.34 | 116 |
| **PERFORMANCE_Positive** | 0.76 | 0.81 | 0.78 | 602 |
| **PRICE_Negative** | 0.44 | 0.54 | 0.49 | 79 |
| **PRICE_Neutral** | 0.75 | 0.76 | 0.75 | 328 |
| **PRICE_Positive** | 0.60 | 0.68 | 0.64 | 162 |
| **SCREEN_Negative** | 0.58 | 0.64 | 0.61 | 116 |
| **SCREEN_Neutral** | 0.00 | 0.00 | 0.00 | 17 |
| **SCREEN_Positive** | 0.60 | 0.76 | 0.67 | 136 |
| **SER&ACC_Negative** | 0.48 | 0.48 | 0.48 | 167 |
| **SER&ACC_Neutral** | 0.17 | 0.07 | 0.10 | 27 |
| **SER&ACC_Positive** | 0.85 | 0.83 | 0.84 | 399 |
| **STORAGE_Negative** | 1.00 | 0.33 | 0.50 | 6 |
| **STORAGE_Neutral** | 0.00 | 0.00 | 0.00 | 3 |
| **STORAGE_Positive** | 0.60 | 0.50 | 0.55 | 18 |
| **Micro Avg** | **0.69** | **0.73** | **0.71** | **6722** |
| **Weighted Avg** | **0.69** | **0.73** | **0.71** | **6722** |

*Đánh giá điểm số: Chỉ số Recall thường cao hơn Precision ở các nhãn Tiêu cực (Negative), thể hiện việc hệ thống được cấu hình ưu tiên bắt giữ các phản hồi xấu để cảnh báo cho doanh nghiệp. Các nhãn Trung tính (Neutral) có độ chính xác thấp hơn do đặc thù thiếu từ khóa cảm xúc mạnh trong ngôn ngữ tự nhiên.*

</details>

---

## Giao diện ứng dụng (Screenshots)

| Trang Chủ (Home Page) |
| :---: |
| ![Home](https://github.com/methaihuy1505/vi-ecommerce-absa-system/blob/main/images/Home.png?raw=true) |

| Chi tiết Sản phẩm & AI Sentiment Radar |
| :---: |
| ![ProductDetail](https://github.com/methaihuy1505/vi-ecommerce-absa-system/blob/main/images/ProductDetail.png?raw=true) |

| Quản trị Doanh nghiệp (Admin Insight) |
| :---: |
| ![AdminInsight](https://github.com/methaihuy1505/vi-ecommerce-absa-system/blob/main/images/AdminInsight.png?raw=true) |

---

## Tài liệu tham khảo

1. Luc Phan Luong et al., *"SA2SL: From Aspect-Based Sentiment Analysis to Social Listening System for Business Intelligence"*. Nguồn dữ liệu gốc: [UIT-ViSFD GitHub Repository](https://github.com/LuongPhan/UIT-ViSFD)
2. Thư viện NLP Tiếng Việt Underthesea: https://github.com/undertheseanlp/underthesea
3. Scikit-learn (Machine Learning in Python): https://scikit-learn.org/
4. Tài liệu nền tảng kiến trúc Microservices với FastAPI, Spring Boot và ReactJS.

---

## Tác giả

[methaihuy1505](https://github.com/methaihuy1505)

