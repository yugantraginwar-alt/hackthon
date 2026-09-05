from typing import List, Dict, Any, Optional
from datetime import datetime
from scanners.base import BaseScanner
from models.schemas import Signal, TransactionAnalysisRequest

# Synthetic known user profile baseline for demo
SYNTHETIC_PROFILE = {
    "user_id": "demo_user_01",
    "known_receivers": {
        "landlord@okhdfcbank",
        "grocery.mart@paytm",
        "rahul.friend@okaxis",
        "electric.board@billdesk",
        "swiggy@icici",
        "chai.point@phonepe",
    },
    "last_known_device": "DEVICE_SAMSUNG_S24_SECURE",
    "usual_location_cluster": "MUMBAI_ANDHERI",
    "historical_avg_amount": 1200.0,
    "historical_std_amount": 600.0,
}

class TransactionScanner(BaseScanner):
    def __init__(self):
        pass

    def analyze(self, tx: TransactionAnalysisRequest) -> List[Signal]:
        signals: List[Signal] = []

        hist_avg = tx.historical_avg_amount or SYNTHETIC_PROFILE["historical_avg_amount"]
        hist_std = SYNTHETIC_PROFILE["historical_std_amount"]

        # 1. Amount anomaly check (> 5x historical average)
        if tx.amount > (5 * hist_avg):
            # Calculate z-score
            z_score = (tx.amount - hist_avg) / max(hist_std, 1.0)
            conf = 0.95 if z_score > 4.0 else 0.85
            signals.append(Signal(
                signal_name="AMOUNT_ANOMALY",
                severity=30,
                confidence=conf,
                source="TXN",
                metadata={
                    "amount": tx.amount,
                    "historical_avg": hist_avg,
                    "multiplier": round(tx.amount / hist_avg, 1),
                    "z_score": round(z_score, 2),
                }
            ))

        # 2. Unknown recipient check
        receiver_clean = tx.receiver.strip().lower()
        if receiver_clean not in SYNTHETIC_PROFILE["known_receivers"]:
            signals.append(Signal(
                signal_name="NEW_RECIPIENT",
                severity=20,
                confidence=0.85,
                source="TXN",
                metadata={"receiver": tx.receiver, "known": False}
            ))

        # 3. Unusual transaction time (00:00 - 05:00)
        hour = 12  # default
        if tx.timestamp:
            try:
                # Try ISO parsing or time format
                dt = datetime.fromisoformat(tx.timestamp.replace("Z", "+00:00"))
                hour = dt.hour
            except Exception:
                pass
        
        if 0 <= hour <= 5:
            signals.append(Signal(
                signal_name="UNUSUAL_TIME",
                severity=15,
                confidence=0.75,
                source="TXN",
                metadata={"hour": hour, "window": "00:00-05:00"}
            ))

        # 4. Device change check
        if tx.device_id and tx.device_id != SYNTHETIC_PROFILE["last_known_device"]:
            signals.append(Signal(
                signal_name="DEVICE_CHANGE",
                severity=20,
                confidence=0.85,
                source="TXN",
                metadata={"device_id": tx.device_id, "expected": SYNTHETIC_PROFILE["last_known_device"]}
            ))

        # 5. Location change check
        if tx.location and tx.location.upper() != SYNTHETIC_PROFILE["usual_location_cluster"]:
            signals.append(Signal(
                signal_name="LOCATION_CHANGE",
                severity=15,
                confidence=0.75,
                source="TXN",
                metadata={"location": tx.location, "expected": SYNTHETIC_PROFILE["usual_location_cluster"]}
            ))

        return signals
