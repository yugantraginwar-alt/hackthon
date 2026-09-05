# IRIS — Intelligent Risk & Impersonation Shield
### Hackathon Project for Problem Statement: **PS-03 — UPI Scam Detection & Risk Analysis System**
**Tagline**: *Detect. Explain. Protect.*

---

## 🛡️ Overview
IRIS is an explainable cybersecurity platform built to inspect suspicious UPI content — **messages, URLs, QR codes, screenshots, and transaction parameters** — before a user pays or interacts with a scammer.

Instead of an opaque score, IRIS follows **DETECT → EXPLAIN → PROTECT**:
1. **DETECT**: Emits standardized, typed security signals from multi-modal scanners.
2. **EXPLAIN**: Itemizes exact point contributions (`+X`) and plain-language reasons why content is dangerous.
3. **PROTECT**: Delivers clear, immediate action guidance (e.g. *"Do not enter your UPI PIN"*, *"Contact 1930"*).

---

## 🌟 Key Differentiators & Highlights
- **Claim-Intent Mismatch Engine**: Detects the #1 most common UPI scam vector in India — where victims are told to *"scan this QR to receive your refund/cashback"*, but the QR actually executes an outgoing `upi://pay` debit transfer.
- **Typosquatting Detection**: Uses Levenshtein distance, Jaro-Winkler string similarity, and homoglyph normalization (`0→o`, `1→l`, `vv→w`, `rn→m`) against legitimate Indian banking domains (`sbi.co.in`, `hdfcbank.com`, `icicibank.com`, `paytm.com`, etc.).
- **Hybrid AI Architecture**: Deterministic declarative rules (YAML) guarantee fast offline execution; lightweight TF-IDF + Logistic Regression classifies scam categories; and pluggable Threat Intelligence falls back safely to local heuristics.
- **Privacy First**: Automatically redacts OTPs, PINs, passwords, and 16-digit card numbers before database persistence.
- **1-Click Golden Test Suite**: Preloaded scenarios for all 6 PRD demo cases with instant verification.

---

## 🏗️ Architecture & Folder Structure
```
iris/
├── backend/
│   ├── api/                   # FastAPI route endpoints
│   ├── database/              # SQLAlchemy models, SQLite/PostgreSQL engine, repository
│   ├── demo_assets/           # Generated test QR assets (fake refund vs legit store)
│   ├── explanation/           # Reason code & actionable recommendation mappings
│   ├── ml/                    # Curated dataset, TF-IDF + Logistic Regression, saved model
│   ├── models/                # Pydantic schemas (Signal, QRPayload, AnalysisResponse)
│   ├── risk_engine/           # Normalized scoring (0-100) & classification thresholds
│   ├── rules/                 # Declarative YAML security rules & evaluator
│   ├── scanners/
│   │   ├── message_scanner/   # Entity extraction + rules + ML + nested URL scanner
│   │   ├── url_scanner/       # Typosquatting + shortener + threat-intel
│   │   ├── qr_scanner/        # OpenCV QR decoder + UPI URI parser + intent mismatch
│   │   ├── screenshot_scanner/# Preprocessing + OCR + parallel QR + unified triage
│   │   └── transaction_scanner/# Behavioral anomalies + z-score deviations
│   ├── services/              # File validation, MIME/size enforcement, sanitizer
│   ├── tests/                 # Comprehensive pytest test suite (10/10 passing)
│   └── main.py                # FastAPI app entrypoint with CORS & DB lifespan
│
├── frontend/
│   ├── src/
│   │   ├── components/        # RiskGauge, ProcessingModal, ResultView, DemoScenarios, etc.
│   │   ├── lib/               # Typed API client
│   │   ├── App.jsx            # Main application shell with 5 modality tabs
│   │   └── index.css          # Vanilla CSS cybersecurity design system (glassmorphism)
│   └── package.json
│
└── docs/
    └── PRD.md                 # Primary source of truth product specification
```

---

## 🚀 Running the Project Locally

### 1. Start Backend (FastAPI)
```bash
# From workspace root:
cd iris/backend

# Run the FastAPI server:
python main.py
```
* The backend will start at `http://localhost:8000`.
* Interactive Swagger API documentation: `http://localhost:8000/docs`.
* Health check: `http://localhost:8000/api/health`.

### 2. Run Backend Tests
```bash
# From workspace root:
python -m pytest iris/backend/tests -v
```
* All 10 test suites run across all demo scenarios, QR claim-intent mismatch, typosquatting, transaction anomalies, and risk engine bounds.

### 3. Start Frontend (React + Vite)
```bash
# In a separate terminal:
cd iris/frontend

# Launch Vite development server:
npm run dev
```
* Open your browser at `http://localhost:5173`.

---

## 🧪 Official PRD Demo Scenarios (Tested & Verified)

| # | Scenario | Sample Input | Expected Result | Differentiator |
|---|---|---|---|---|
| **1** | **Fake KYC Expiry** | *"Your KYC has expired. Your UPI will be blocked today. Verify immediately at https://sbi-kyc-update.online"* | **HIGH RISK (94/100)** | Urgency + KYC combo + phishing link |
| **2** | **Fake Refund QR** | Claim: *"Receive refund of ₹5,000"* with `upi://pay` QR | **HIGH RISK (95/100)** | **Claim-Intent Mismatch**: Flags outgoing debit |
| **3** | **Typosquatted URL** | `https://bank-examp1e.com/sbi/verify-login` | **HIGH RISK** | Homoglyph/Levenshtein matching against legitimate brand |
| **4** | **Scam Screenshot** | Chat screenshot with prize lure + payment link | **HIGH RISK** | Multi-modal OCR + entity extraction |
| **5** | **Legitimate Message**| Routine NEFT credit SMS | **SAFE (0/100)** | Zero false alarm on genuine transaction alert |
| **6** | **Suspicious Transaction**| ₹28,000 at 03:30 AM to unknown recipient from new device | **SUSPICIOUS / HIGH RISK** | Behavioral anomaly (>5x baseline, z-score > 4.0) |

---

## 🔒 Security & Privacy Posture
- **Input Sanitization**: Automatically scrubs OTPs, PINs, passwords, and 16-digit card numbers.
- **Safe Link Handling**: Capped HEAD requests with strict timeout (2.0s); never renders arbitrary external JavaScript or untrusted DOM.
- **Resilient Fallbacks**: If ML or external threat-intel APIs are unavailable, deterministic rules and local heuristics maintain 100% functionality without crashing.
