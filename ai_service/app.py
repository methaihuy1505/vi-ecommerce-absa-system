from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import numpy as np
from underthesea import word_tokenize
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Sentiment API", version="Demo Edition")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

print("Đang nạp 'bộ não' F1-0.71 lên Server...")
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
model = joblib.load('models/absa_ml_model.pkl')
label_names = joblib.load('models/label_names.pkl')

# 1. HẠ NGƯỠNG ĐỂ VỚT CÁC CÂU DÀI BỊ PHA LOÃNG
CLASS_THRESHOLDS = {
    'BATTERY': 0.40,       'BATTERY_Neutral': 0.65,
    'CAMERA': 0.45,        'CAMERA_Neutral': 0.65,
    'PERFORMANCE': 0.45,   'PERFORMANCE_Neutral': 0.65,
    'GENERAL': 0.55,       'GENERAL_Neutral': 0.70, # General dễ bị nhiễu nên giữ cao
    'SCREEN': 0.45,        'SCREEN_Neutral': 0.65,
    'DESIGN': 0.45,        'DESIGN_Neutral': 0.65,
    'FEATURES': 0.45,      'FEATURES_Neutral': 0.65,
    'PRICE': 0.40,         'PRICE_Neutral': 0.65,   # Hạ Price xuống 40%
    'SER&ACC': 0.45,       'SER&ACC_Neutral': 0.65,
    'STORAGE': 0.45,       'STORAGE_Neutral': 0.65,
}

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = word_tokenize(text, format="text")
    return re.sub(r'\s+', ' ', text).strip()

class CommentRequest(BaseModel):
    comment: str

@app.post("/predict")
def predict_sentiment(req: CommentRequest):
    cleaned = clean_text(req.comment)
    vec = vectorizer.transform([cleaned])
    
    decision_scores = model.decision_function(vec)[0]
    
    raw_results = {}
    # Bước 1: Lọc thô bằng Threshold
    for i, score in enumerate(decision_scores):
        label = label_names[i]
        aspect = label.split('_')[0]
        
        threshold = CLASS_THRESHOLDS.get(label, CLASS_THRESHOLDS.get(aspect, 0.40))
        pseudo_prob = float(1 / (1 + np.exp(-score)))
        
        if pseudo_prob >= threshold:
            raw_results[label] = round(pseudo_prob * 100, 1)

    # Bước 2: RULE ĐỘC QUYỀN (SMART FILTER)
    # Lọc lại: Nếu 1 Aspect có cả Positive, Negative, Neutral -> Chỉ giữ lại cái có % cao nhất!
    aspect_groups = {}
    for label, prob in raw_results.items():
        aspect = label.split('_')[0]
        if aspect not in aspect_groups:
            aspect_groups[aspect] = []
        aspect_groups[aspect].append((label, prob))

    final_results = {}
    for aspect, labels in aspect_groups.items():
        # labels là một list chứa tuple dạng: [('PRICE_Negative', 78.9), ('PRICE_Positive', 57.4)]
        # Tìm nhãn có % lớn nhất
        best_label = max(labels, key=lambda x: x[1])
        final_results[best_label[0]] = best_label[1]

    return {
        "original_comment": req.comment,
        "predictions": final_results
    }

@app.get("/")
def read_root():
    return {"message": "AI Service is running successfully!"}