import joblib
import re
import numpy as np
from underthesea import word_tokenize

print("Đang tải 'não bộ' F1-0.71 lên...")
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
model = joblib.load('models/absa_ml_model.pkl')
label_names = joblib.load('models/label_names.pkl')

# ĐỒNG NHẤT THRESHOLD VỚI WEB API (Ép cứng các nhãn Neutral không được hiện linh tinh)
CLASS_THRESHOLDS = {
    'BATTERY': 0.45,       'BATTERY_Neutral': 0.65,
    'CAMERA': 0.50,        'CAMERA_Neutral': 0.65,
    'PERFORMANCE': 0.50,   'PERFORMANCE_Neutral': 0.65,
    'GENERAL': 0.60,       'GENERAL_Neutral': 0.65,
    'SCREEN': 0.55,        'SCREEN_Neutral': 0.65,
    'DESIGN': 0.50,        'DESIGN_Neutral': 0.65,
    'FEATURES': 0.50,      'FEATURES_Neutral': 0.65,
    'PRICE': 0.50,         'PRICE_Neutral': 0.65,
    'SER&ACC': 0.50,       'SER&ACC_Neutral': 0.65,
    'STORAGE': 0.50,       'STORAGE_Neutral': 0.65,
}

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = word_tokenize(text, format="text")
    return re.sub(r'\s+', ' ', text).strip()

def predict_comment(comment):
    cleaned = clean_text(comment)
    vec = vectorizer.transform([cleaned])
    
    # Dùng decision_function gốc của SVM
    decision_scores = model.decision_function(vec)[0]
    
    results = []
    for i, score in enumerate(decision_scores):
        label = label_names[i]
        aspect = label.split('_')[0]
        
        # Lấy threshold riêng: ưu tiên nhãn cụ thể trước (ví dụ BATTERY_Neutral), không có mới lấy Aspect
        threshold = CLASS_THRESHOLDS.get(label, CLASS_THRESHOLDS.get(aspect, 0.50))
        
        # Hàm Sigmoid biến đổi khoảng cách thành xác suất pseudo
        pseudo_prob = float(1 / (1 + np.exp(-score)))
        
        if pseudo_prob >= threshold:
            results.append(f"{label} ({pseudo_prob*100:.1f}%)")
            
    return results

test_comments = [
    "Máy này thiết kế đẹp lung linh, nhưng pin thì tụt nhanh như tụt quần, giá lại còn chát quá!",
    "Chơi game liên quân mượt phết, nhân viên thegioididong phục vụ cực kỳ tận tình",
    "Camera chụp đêm bị nhòe, tao thật sự thất vọng về sản phẩm này."
]

print("\n" + "="*50)
print("BẮT ĐẦU DỰ ĐOÁN THỰC TẾ:")
print("="*50)
for c in test_comments:
    print(f"Khách: '{c}'")
    print(f"AI   : {predict_comment(c)}")
    print("-" * 50)