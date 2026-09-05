# IRIS — Intelligent Risk & Impersonation Shield
## Problem Statement: PS-03 — UPI Scam Detection & Risk Analysis System
**Tagline**: Detect. Explain. Protect.
**Document Type**: Hackathon MVP PRD

---

## 1. Executive Summary
IRIS (Intelligent Risk & Impersonation Shield) is a web-based cybersecurity platform that analyzes suspicious UPI-related content — messages, URLs, QR codes, screenshots, and transaction details — before a user pays or interacts with a potential attacker. Rather than a single "is this a scam?" verdict, IRIS produces a 0–100 risk score, a SAFE / SUSPICIOUS / HIGH RISK classification, a detected scam category, a breakdown of the individual risk signals that drove the score, and a clear recommended action.

The system is built on a hybrid detection philosophy:
- **Deterministic rules**: Fast, explainable, always-available coverage.
- **Lightweight supervised ML classifier**: Text generalization using TF-IDF + Logistic Regression.
- **Threat-intelligence abstraction layer**: URL reputation checking with offline heuristics fallback.
- **Anomaly detection**: Identifies behavioral spikes in transaction patterns.

All five scanners emit a common, structured `Signal` object so a central Risk Engine and Explanation Engine can combine and narrate results consistently regardless of input type.

---

## 2. Modalities & Detection Algorithms
1. **Message Scanner** (`POST /api/analyze/message`):
   - Regex entity extraction (URLs, UPI IDs, phone numbers, amounts).
   - Lexicon keyword pattern matching for KYC, OTP, urgency, and authority impersonation.
   - TF-IDF + Logistic Regression classification.
   - Nested URL inspection when links are present.
2. **URL Scanner** (`POST /api/analyze/url`):
   - Structural features (length, special character density, digit ratio, IP host, punycode, subdomain depth).
   - Typosquatting detection against curated Indian banking domains using Levenshtein distance, Jaro-Winkler similarity, and homoglyphs.
   - Safe capped redirect resolution (HEAD requests with strict timeout).
   - Threat intelligence abstraction with local heuristic fallback.
3. **QR Scanner** (`POST /api/analyze/qr`):
   - OpenCV QRCodeDetector + pyzbar fallback.
   - UPI payload parameter parsing (`pa`, `pn`, `am`, `tr`, `cu`, `mc`).
   - Payment intent enforcement (standard `upi://pay` always initiates outgoing debit).
   - Landmark `CLAIM_INTENT_MISMATCH` detection: flags when user is promised an incoming refund or cashback but QR executes an outgoing payment.
4. **Screenshot Scanner** (`POST /api/analyze/screenshot`):
   - Image preprocessing (grayscale, bilateral denoising, adaptive thresholding).
   - Parallel OCR text extraction and embedded QR decoding.
   - Unified multi-modal aggregation.
5. **Transaction Scanner** (`POST /api/analyze/transaction`):
   - Threshold checks: Amount > 5x historical average (`AMOUNT_ANOMALY`), unverified receiver (`NEW_RECIPIENT`), overnight hours 00:00–05:00 (`UNUSUAL_TIME`), device change (`DEVICE_CHANGE`), location variance (`LOCATION_CHANGE`).
   - Statistical z-score outlier scoring.

---

## 3. Risk Engine Formula
- `raw_score = Σ (severity_i × confidence_i)`
- `normalized_score = min(100, raw_score)`
- Guaranteed High-Risk Floor (≥75) for critical signals (`CLAIM_INTENT_MISMATCH`, `OTP_PIN_REQUEST`, `KNOWN_MALICIOUS_URL`, `TYPOSQUATTED_DOMAIN`).

Classification:
- 0–30: SAFE
- 31–70: SUSPICIOUS
- 71–100: HIGH RISK

---

## 4. Privacy & Safety Guarantee
- Sensitive credentials (OTPs, UPI PINs, passwords, full card numbers) are stripped and sanitized prior to database persistence or display.
- No live banking credentials or real money movement are ever executed.
