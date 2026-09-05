import cv2
import numpy as np
from typing import List, Tuple, Optional, Dict, Any
from scanners.base import BaseScanner
from models.schemas import Signal, QRPayload
from .parser import parse_upi_uri, is_verified_merchant_handle

class QRScanner(BaseScanner):
    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    def decode_image_bytes(self, image_bytes: bytes) -> Tuple[Optional[str], Optional[np.ndarray]]:
        """
        Decodes a QR code from image bytes using OpenCV QRCodeDetector,
        falling back to pyzbar if installed and needed.
        """
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                return None, None

            # 1. Primary OpenCV QR decode
            val, points, _ = self.detector.detectAndDecode(img)
            if val and len(val.strip()) > 0:
                return val.strip(), img

            # 2. Try preprocessed (grayscale + adaptive threshold)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            val, points, _ = self.detector.detectAndDecode(gray)
            if val and len(val.strip()) > 0:
                return val.strip(), img

            # 3. Try pyzbar fallback if available
            try:
                from pyzbar.pyzbar import decode as pyzbar_decode
                decoded_objects = pyzbar_decode(img)
                if decoded_objects:
                    for obj in decoded_objects:
                        if obj.data:
                            return obj.data.decode("utf-8", errors="ignore").strip(), img
            except Exception:
                pass

            return None, img
        except Exception as e:
            print(f"QR decode error: {e}")
            return None, None

    def analyze(self, input_data: Any) -> Tuple[List[Signal], Optional[QRPayload]]:
        """
        input_data can be:
        - bytes (image bytes)
        - Dict with 'image_bytes' and optional 'context_claim' (e.g. "Receive refund")
        """
        signals: List[Signal] = []
        image_bytes: Optional[bytes] = None
        context_claim: Optional[str] = None

        if isinstance(input_data, bytes):
            image_bytes = input_data
        elif isinstance(input_data, dict):
            image_bytes = input_data.get("image_bytes")
            context_claim = input_data.get("context_claim")

        if not image_bytes:
            signals.append(Signal(
                signal_name="INVALID_IMAGE_PAYLOAD",
                severity=10,
                confidence=1.0,
                source="QR",
                metadata={"error": "No image bytes provided"}
            ))
            return signals, None

        payload_str, _ = self.decode_image_bytes(image_bytes)

        if not payload_str:
            signals.append(Signal(
                signal_name="NON_DECODABLE_QR",
                severity=10,
                confidence=0.85,
                source="QR",
                metadata={"guidance": "No clear QR code pattern detected in the uploaded image"}
            ))
            return signals, None

        # Parse payload
        qr_payload = parse_upi_uri(payload_str)

        if not qr_payload.is_upi:
            signals.append(Signal(
                signal_name="NON_UPI_QR",
                severity=5,
                confidence=0.95,
                source="QR",
                metadata={"payload": payload_str[:100]}
            ))
            return signals, qr_payload

        # It IS a UPI QR code!
        # Standard upi://pay initiates an outgoing payment (You send money)
        signals.append(Signal(
            signal_name="QR_INITIATES_PAYMENT",
            severity=15,
            confidence=0.98,
            source="QR",
            metadata={"direction": "SEND_MONEY", "payee": qr_payload.payee_vpa}
        ))

        # Check unverified recipient VPA
        if not is_verified_merchant_handle(qr_payload.payee_vpa):
            signals.append(Signal(
                signal_name="UNVERIFIED_RECIPIENT",
                severity=20,
                confidence=0.85,
                source="QR",
                metadata={"payee_vpa": qr_payload.payee_vpa, "payee_name": qr_payload.payee_name}
            ))

        # Check pre-filled amount
        if qr_payload.amount and qr_payload.amount > 0:
            signals.append(Signal(
                signal_name="AMOUNT_PRESENT_UNCONFIRMED",
                severity=15,
                confidence=0.90,
                source="QR",
                metadata={"amount": qr_payload.amount, "currency": qr_payload.currency}
            ))

        # CRITICAL: Claim-intent mismatch check!
        # If user was told "Scan to receive refund / cashback / money / lottery", but QR is upi://pay
        if context_claim:
            claim_lower = context_claim.lower()
            receive_keywords = ["refund", "receive", "cashback", "credit", "reward", "accept money", "claim prize", "win"]
            if any(kw in claim_lower for kw in receive_keywords):
                signals.append(Signal(
                    signal_name="CLAIM_INTENT_MISMATCH",
                    severity=45,
                    confidence=0.98,
                    source="QR",
                    metadata={
                        "user_claim": context_claim,
                        "actual_qr_action": "DEBIT_FROM_SCANNER",
                        "explanation": "QR initiates an outgoing payment from your account, directly contradicting the claim that you will receive a refund or money."
                    }
                ))

        return signals, qr_payload
