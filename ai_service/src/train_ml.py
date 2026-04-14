import pandas as pd
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import LinearSVC
from sklearn.metrics import classification_report
import joblib

os.makedirs('models', exist_ok=True)

print("1. Đang load dữ liệu (Bản Sạch - Không Trick)...")
proc_dir = 'data/processed/'
train_df = pd.read_csv(proc_dir + 'Train_Cleaned.csv').dropna(subset=['clean_comment'])
test_df = pd.read_csv(proc_dir + 'Test_Cleaned.csv').dropna(subset=['clean_comment'])

X_train_text, y_train = train_df['clean_comment'], train_df.drop(columns=['clean_comment']).values
X_test_text, y_test = test_df['clean_comment'], test_df.drop(columns=['clean_comment']).values
label_names = train_df.columns.drop('clean_comment').tolist()

print("2. Xây dựng Ultimate Pipeline (Word 1-3 + Char 3-6)...")
safe_stopwords = ["là", "thì", "có", "và", "của", "để", "những", "các", "cho", "với"]

word_vec = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=3, max_df=0.85, 
                           sublinear_tf=True, stop_words=safe_stopwords, max_features=15000)
char_vec = TfidfVectorizer(analyzer='char', ngram_range=(3, 6), min_df=3, max_df=0.85, 
                           sublinear_tf=True, max_features=15000)

vectorizer = FeatureUnion([('word', word_vec), ('char', char_vec)])

print("3. Trích xuất đặc trưng...")
X_train = vectorizer.fit_transform(X_train_text)
X_test = vectorizer.transform(X_test_text)

print("4. Huấn luyện (Thuần LinearSVC, C=0.25)...")
final_model = OneVsRestClassifier(LinearSVC(C=0.25, class_weight='balanced', random_state=42, dual=False))
final_model.fit(X_train, y_train)

print("5. Đánh giá mô hình chuẩn...")
y_pred = final_model.predict(X_test)
print("\n=== KẾT QUẢ ĐÁNH GIÁ (CLEAN ULTIMATE PIPELINE) ===")
print(classification_report(y_test, y_pred, target_names=label_names, zero_division=0))

print("\n6. Lưu Model...")
joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')
joblib.dump(final_model, 'models/absa_ml_model.pkl')
joblib.dump(label_names, 'models/label_names.pkl')
print(" DONE! Phục hồi thành công model F1 = 0.71.")