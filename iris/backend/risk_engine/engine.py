from typing import List, Tuple, Dict, Any, Optional
from models.schemas import Signal

# Deterministic signals that should immediately push classification to HIGH_RISK
CRITICAL_HIGH_RISK_SIGNALS = {
    "CLAIM_INTENT_MISMATCH",
    "OTP_PIN_REQUEST",
    "KNOWN_MALICIOUS_URL",
    "TYPOSQUATTED_DOMAIN",
    "KYC_URGENCY_COMBO"
}

class RiskEngine:
    def __init__(
        self,
        safe_threshold: int = 30,
        suspicious_threshold: int = 70
    ):
        self.safe_threshold = safe_threshold
        self.suspicious_threshold = suspicious_threshold

    def calculate_score(self, signals: List[Signal]) -> Tuple[int, str, Optional[str]]:
        """
        Aggregates signals into normalized 0-100 score and classification.
        Returns: (risk_score, classification, primary_scam_category)
        """
        if not signals:
            return 0, "SAFE", None

        # Filter out informational signals (severity == 0)
        scoring_signals = [s for s in signals if s.severity > 0]
        if not scoring_signals:
            return 0, "SAFE", None

        # Calculate raw score: sum(severity_i * confidence_i)
        raw_score = 0.0
        categories_found: Dict[str, float] = {}

        for s in scoring_signals:
            contrib = s.severity * s.confidence
            raw_score += contrib

            # Accumulate category weights
            cat = None
            if s.metadata and "category" in s.metadata:
                cat = s.metadata["category"]
            elif s.metadata and "predicted_scam_category" in s.metadata:
                cat = s.metadata["predicted_scam_category"]
            
            if cat and cat != "SAFE":
                categories_found[cat] = categories_found.get(cat, 0.0) + contrib

        normalized_score = min(100, int(round(raw_score)))

        # High risk threshold guarantee for critical signals
        has_critical = any(s.signal_name in CRITICAL_HIGH_RISK_SIGNALS for s in scoring_signals)
        if has_critical and normalized_score < 75:
            normalized_score = max(normalized_score, 75)

        # Classification
        if normalized_score <= self.safe_threshold:
            classification = "SAFE"
        elif normalized_score <= self.suspicious_threshold:
            classification = "SUSPICIOUS"
        else:
            classification = "HIGH_RISK"

        # Determine most prominent scam category
        primary_category = None
        if categories_found:
            primary_category = max(categories_found, key=categories_found.get)
        elif has_critical:
            for s in scoring_signals:
                if s.signal_name == "CLAIM_INTENT_MISMATCH":
                    primary_category = "QR_SCAM"
                    break
                elif s.signal_name == "OTP_PIN_REQUEST":
                    primary_category = "OTP_SCAM"
                    break
                elif s.signal_name in ("TYPOSQUATTED_DOMAIN", "KNOWN_MALICIOUS_URL"):
                    primary_category = "PHISHING"
                    break

        return normalized_score, classification, primary_category
