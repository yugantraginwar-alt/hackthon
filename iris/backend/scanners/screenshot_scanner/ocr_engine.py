import cv2
import numpy as np
import re
from typing import Tuple, Optional

class OCREngine:
    def __init__(self):
        self.tesseract_available = False
        try:
            import pytesseract
            # Test if tesseract is callable
            pytesseract.get_tesseract_version()
            self.tesseract_available = True
        except Exception:
            self.tesseract_available = False

    def preprocess_image(self, img: np.ndarray) -> np.ndarray:
        """
        Preprocesses image for OCR:
        - Resize if too large while maintaining aspect ratio
        - Convert to grayscale
        - Bilateral filter to reduce noise while preserving edges
        - Otsu thresholding
        """
        h, w = img.shape[:2]
        max_dim = 1600
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        # Grayscale
        if len(img.shape) == 3:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            gray = img

        # Denoise
        denoised = cv2.bilateralFilter(gray, 9, 75, 75)

        # Adaptive/Otsu threshold
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        return thresh

    def extract_text(self, image_bytes: bytes) -> Tuple[str, float, Optional[np.ndarray]]:
        """
        Returns (extracted_text, confidence_score, cv_image)
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return "", 0.0, None

        if self.tesseract_available:
            try:
                import pytesseract
                preprocessed = self.preprocess_image(img)
                data = pytesseract.image_to_data(preprocessed, output_type=pytesseract.Output.DICT)
                
                # Filter high confidence words
                words = []
                confs = []
                for i in range(len(data['text'])):
                    text = data['text'][i].strip()
                    conf = float(data['conf'][i])
                    if text and conf > 0:
                        words.append(text)
                        confs.append(conf)

                full_text = " ".join(words)
                avg_conf = (sum(confs) / len(confs)) / 100.0 if confs else 0.0
                return full_text, avg_conf, img
            except Exception as e:
                print(f"Pytesseract error: {e}")

        # Fallback: if tesseract binary is not on host, OCR confidence is low
        # System can still analyze any embedded QR and return informational signal
        return "", 0.0, img
