import joblib
import re
import numpy as np
from underthesea import word_tokenize

# Khởi tạo
print("Đang nạp 'bộ não' F1-0.71 lên Hệ thống Dự đoán...")
try:
    vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
    model = joblib.load('models/absa_ml_model.pkl')
    label_names = joblib.load('models/label_names.pkl')
except Exception as e:
    print(f"Lỗi tải model: {e}")
    exit()

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = word_tokenize(text, format="text")
    return re.sub(r'\s+', ' ', text).strip()

def predict_comment_hybrid(comment):
    cleaned = clean_text(comment)
    vec = vectorizer.transform([cleaned])
    
    # Bước 1: AI tự phán (1/0)
    predictions = model.predict(vec)[0]
    decision_scores = model.decision_function(vec)[0]
    
    raw_results = {}
    for i, is_predicted in enumerate(predictions):
        if is_predicted == 1:
             label = label_names[i]
             score = decision_scores[i]
             pseudo_prob = float(1 / (1 + np.exp(-score)))
             raw_results[label] = round(pseudo_prob * 100, 1)

    # Bước 2: Smart Filter giữ lại 1 Aspect cao nhất
    aspect_groups = {}
    for label, prob in raw_results.items():
        aspect = label.split('_')[0]
        if aspect not in aspect_groups:
            aspect_groups[aspect] = []
        aspect_groups[aspect].append((label, prob))

    final_results = {}
    for aspect, labels in aspect_groups.items():
        best_label = max(labels, key=lambda x: x[1])
        final_results[best_label[0]] = best_label[1]
            
    return final_results

# 20 DỮ LIỆU MẪU CHUẨN ĐỂ DEMO
test_comments = [
    "Máy đẹp, cầm rất nhẹ tay nhờ khung Titan, nhưng giá hơi cao.",
    "Pin dùng được cả ngày, chơi game cực mượt không nóng máy.",
    "Thiết kế mỏng nhẹ quá tuyệt cho dân văn phòng, mà pin lại trâu.",
    "Màn hình 240Hz làm việc hay chơi game đều phê, mỗi tội quạt hơi ồn.",
    "Chống ồn quá đỉnh, đeo êm tai không bị đau khi dùng lâu.",
    "Camera chụp đêm bị nhòe, tao thật sự thất vọng về sản phẩm này.",
    "Loa nghe nhạc vàng rất ấm, bass lực nhưng kết nối bluetooth đôi khi bị chập chờn.",
    "Bàn phím gõ rất sướng tay, nhưng đèn LED hơi yếu không dùng được buổi tối.",
    "Giá này thì không đòi hỏi gì hơn, hiệu năng ổn định cho sinh viên.",
    "Mua mới mắc quá, mua cũ hiệu năng cũng không kém mà giá rẻ hơn.",
    "Sạc siêu nhanh, chỉ 15 phút là đầy 50%, cực kỳ hài lòng.",
    "Máy hay bị lag khi mở nhiều tab Chrome, thất vọng về RAM quá.",
    "Màu sắc màn hình bị ám vàng, xem phim không thực tế chút nào.",
    "Vỏ nhựa nhìn hơi rẻ tiền nhưng bù lại phần cứng bên trong rất mạnh.",
    "Giao hàng nhanh, đóng gói kỹ, máy dùng ổn trong tầm giá.",
    "Nút bấm hơi cứng, dùng lâu bị mỏi ngón tay, cần cải thiện công thái học.",
    "Âm thanh bị rè khi bật âm lượng tối đa, thất vọng về loa.",
    "Phần mềm hay bị văng ứng dụng đột ngột, tối ưu hóa quá kém.",
    "Kết nối 5G rất nhanh và ổn định, bắt sóng khỏe ở vùng sâu vùng xa.",
    "Chuột cầm rất vừa tay, các nút phụ hỗ trợ công việc rất tốt."
]

print("\n" + "="*85)
print(f"{'STT':<5} | {'DỰ ĐOÁN AI (PREDICT GỐC + SMART FILTER)':<55}")
print("-" * 85)

for idx, c in enumerate(test_comments, 1):
    final_res = predict_comment_hybrid(c)
    res_str = str(final_res) if final_res else "{}"
    print(f"{idx:<5} | {res_str}")
    if idx % 5 == 0: print("-" * 85)

print("="*85)