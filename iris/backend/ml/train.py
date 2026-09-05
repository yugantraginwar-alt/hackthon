import os
import json
import joblib
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
from dataset import DATASET

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_model")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_and_save():
    texts = [item["text"] for item in DATASET]
    labels = [item["label"] for item in DATASET]

    print(f"Training TF-IDF + Logistic Regression on {len(texts)} samples across {len(set(labels))} labels...")

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2500,
        sublinear_tf=True,
        lowercase=True,
    )
    
    X_tfidf = vectorizer.fit_transform(texts)
    
    classifier = LogisticRegression(
        C=2.0,
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )
    classifier.fit(X_tfidf, labels)

    train_preds = classifier.predict(X_tfidf)
    print("Training report:")
    print(classification_report(labels, train_preds))

    # Save artifacts
    vec_path = os.path.join(MODEL_DIR, "vectorizer.joblib")
    clf_path = os.path.join(MODEL_DIR, "classifier.joblib")
    meta_path = os.path.join(MODEL_DIR, "model_meta.json")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(classifier, clf_path)

    metadata = {
        "model_version": "v0.1-demo",
        "algorithm": "TF-IDF + Logistic Regression",
        "classes": list(classifier.classes_),
        "sample_count": len(texts),
        "trained_at": datetime.utcnow().isoformat(),
        "disclosure": "Trained on curated and synthetic Indian UPI fraud scenarios for demo and hackathon prototype purposes. Not validated against live NPCI production data."
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model and vectorizer saved to {MODEL_DIR}")

if __name__ == "__main__":
    train_and_save()
