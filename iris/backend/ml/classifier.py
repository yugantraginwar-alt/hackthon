import os
import json
import joblib
from typing import Dict, Any, Optional, Tuple
from models.schemas import Signal

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_model")

class MLTextClassifier:
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.metadata = {}
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        vec_path = os.path.join(MODEL_DIR, "vectorizer.joblib")
        clf_path = os.path.join(MODEL_DIR, "classifier.joblib")
        meta_path = os.path.join(MODEL_DIR, "model_meta.json")

        if os.path.exists(vec_path) and os.path.exists(clf_path):
            try:
                self.vectorizer = joblib.load(vec_path)
                self.classifier = joblib.load(clf_path)
                if os.path.exists(meta_path):
                    with open(meta_path, "r", encoding="utf-8") as f:
                        self.metadata = json.load(f)
                self.is_loaded = True
            except Exception as e:
                print(f"Warning: Failed to load ML model: {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def predict(self, text: str) -> Tuple[Optional[str], float, Dict[str, float]]:
        """
        Returns (predicted_label, confidence, all_probabilities)
        """
        if not self.is_loaded or not text.strip():
            return None, 0.0, {}

        try:
            X = self.vectorizer.transform([text])
            probs = self.classifier.predict_proba(X)[0]
            classes = self.classifier.classes_

            prob_dict = {cls_name: float(prob) for cls_name, prob in zip(classes, probs)}
            best_class = max(prob_dict, key=prob_dict.get)
            best_prob = prob_dict[best_class]

            return best_class, best_prob, prob_dict
        except Exception as e:
            print(f"ML inference error: {e}")
            return None, 0.0, {}

    def get_signal(self, text: str) -> Optional[Signal]:
        """
        Generates supporting ML_TEXT_SCAM_PROBABILITY signal.
        Capped contribution to avoid sole override.
        """
        best_class, conf, _ = self.predict(text)
        if not best_class or best_class == "SAFE" or conf < 0.35:
            return None

        # Severity is proportional to confidence, capped at 25 points
        severity = min(25, int(round(conf * 25)))
        return Signal(
            signal_name="ML_TEXT_SCAM_PROBABILITY",
            severity=severity,
            confidence=round(conf, 2),
            source="ML",
            metadata={
                "predicted_scam_category": best_class,
                "model_version": self.metadata.get("model_version", "v0.1-demo"),
            }
        )
