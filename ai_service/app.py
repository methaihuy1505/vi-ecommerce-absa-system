from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import numpy as np
from underthesea import word_tokenize
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Sentiment API", version="Hybrid Edition")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

print("Đang nạp 'bộ não' F1-0.71 lên Server...")
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')
model = joblib.load('models/absa_ml_model.pkl')
label_names = joblib.load('models/label_names.pkl')

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
    
    # Bước 1: Dùng hàm predict mặc định của SVM (AI tự phân xử ngưỡng)
    predictions = model.predict(vec)[0]
    decision_scores = model.decision_function(vec)[0]
    
    raw_results = {}
    for i, is_predicted in enumerate(predictions):
        if is_predicted == 1:
             label = label_names[i]
             score = decision_scores[i]
             pseudo_prob = float(1 / (1 + np.exp(-score)))
             raw_results[label] = round(pseudo_prob * 100, 1)

    # Bước 2: Smart Filter - Xử lý xung đột (Mixed Polarity)
    aspect_groups = {}
    for label, prob in raw_results.items():
        aspect = label.split('_')[0]
        if aspect not in aspect_groups:
            aspect_groups[aspect] = []
        aspect_groups[aspect].append((label, prob))

    final_results = {}
    for aspect, labels in aspect_groups.items():
        # Chọn nhãn có % tự tin cao nhất trong cùng 1 Aspect
        best_label = max(labels, key=lambda x: x[1])
        final_results[best_label[0]] = best_label[1]

    return {
        "original_comment": req.comment,
        "predictions": final_results
    }

@app.get("/")
def read_root():
    return {"message": "AI Service is running successfully!"}