from typing import List, Tuple, Dict, Any, Optional
from scanners.base import BaseScanner
from models.schemas import Signal, ExtractedEntities, QRPayload
from .ocr_engine import OCREngine
from scanners.message_scanner import MessageScanner
from scanners.qr_scanner import QRScanner

class ScreenshotScanner(BaseScanner):
    def __init__(self):
        self.ocr_engine = OCREngine()
        self.message_scanner = MessageScanner()
        self.qr_scanner = QRScanner()

    def analyze(self, image_bytes: bytes) -> Tuple[List[Signal], ExtractedEntities, Optional[QRPayload], Dict[str, Any]]:
        signals: List[Signal] = []
        qr_payload: Optional[QRPayload] = None

        # 1. Extract text via OCR
        ocr_text, ocr_conf, img = self.ocr_engine.extract_text(image_bytes)

        # 2. Parallel QR Detection on the screenshot
        qr_signals, qr_data = self.qr_scanner.analyze(image_bytes)
        if qr_data and qr_data.is_upi:
            qr_payload = qr_data
            signals.extend(qr_signals)

        # 3. Text & Message Analysis if text extracted
        entities = ExtractedEntities()
        if ocr_text:
            msg_signals, entities, msg_meta = self.message_scanner.analyze(ocr_text)
            signals.extend(msg_signals)
        else:
            # Low or missing OCR extraction note
            signals.append(Signal(
                signal_name="LOW_OCR_CONFIDENCE",
                severity=0,  # Informational only, does NOT raise risk score
                confidence=0.90,
                source="OCR",
                metadata={"guidance": "Image text was unclear or OCR engine not available. Please verify visually or paste text."}
            ))

        metadata = {
            "ocr_confidence": round(ocr_conf, 2),
            "ocr_text_length": len(ocr_text),
            "embedded_qr_found": qr_payload is not None,
            "tesseract_available": self.ocr_engine.tesseract_available,
        }

        # Deduplicate signals
        deduped: Dict[str, Signal] = {}
        for s in signals:
            if s.signal_name not in deduped:
                deduped[s.signal_name] = s
            else:
                existing = deduped[s.signal_name]
                if s.severity > existing.severity:
                    deduped[s.signal_name] = s

        return list(deduped.values()), entities, qr_payload, metadata
