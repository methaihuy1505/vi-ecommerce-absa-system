import pandas as pd
import re
import os
from sklearn.preprocessing import MultiLabelBinarizer
from underthesea import word_tokenize

# Đảm bảo thư mục lưu trữ tồn tại
os.makedirs('data/processed', exist_ok=True)

def clean_and_tokenize(text):
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = word_tokenize(text, format="text")
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_labels(label_str):
    if pd.isna(label_str):
        return []
    matches = re.findall(r'\{(.*?)#(.*?)\}', str(label_str))
    labels = [f"{aspect}_{sentiment}" for aspect, sentiment in matches if aspect != "OTHERS"]
    return labels

def process_dataset(input_path):
    print(f"Đang xử lý {input_path}...")
    df = pd.read_csv(input_path)
    df['clean_comment'] = df['comment'].apply(clean_and_tokenize)
    df['parsed_labels'] = df['label'].apply(extract_labels)
    return df

if __name__ == "__main__":
    raw_dir = 'data/raw/'
    out_dir = 'data/processed/'
    
    # 1. Đọc file
    train_df = process_dataset(raw_dir + 'Train.csv')
    dev_df = process_dataset(raw_dir + 'Dev.csv')
    test_df = process_dataset(raw_dir + 'Test.csv')

    # 2. Biến đổi nhãn
    print("Đang tạo ma trận Nhãn (One-Hot)...")
    mlb = MultiLabelBinarizer()
    y_train = mlb.fit_transform(train_df['parsed_labels'])
    y_dev = mlb.transform(dev_df['parsed_labels'])
    y_test = mlb.transform(test_df['parsed_labels'])

    # 3. Ghép và lưu
    train_out = pd.concat([train_df[['clean_comment']], pd.DataFrame(y_train, columns=mlb.classes_)], axis=1)
    dev_out = pd.concat([dev_df[['clean_comment']], pd.DataFrame(y_dev, columns=mlb.classes_)], axis=1)
    test_out = pd.concat([test_df[['clean_comment']], pd.DataFrame(y_test, columns=mlb.classes_)], axis=1)

    train_out.to_csv(out_dir + 'Train_Cleaned.csv', index=False)
    dev_out.to_csv(out_dir + 'Dev_Cleaned.csv', index=False)
    test_out.to_csv(out_dir + 'Test_Cleaned.csv', index=False)
    
    print(f"\n Đã xử lý xong! Các file sạch đã được lưu tại: {out_dir}")