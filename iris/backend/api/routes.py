import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from models.schemas import (
    MessageAnalysisRequest,
    URLAnalysisRequest,
    TransactionAnalysisRequest,
    UnifiedAnalysisRequest,
    AnalysisResponse,
    Signal,
    ExtractedEntities,
    QRPayload,
)
from database import (
    get_db,
    save_analysis,
    get_analysis_by_id,
    get_recent_analyses,
    get_stats_summary,
)
from scanners.message_scanner import MessageScanner
from scanners.url_scanner import URLScanner
from scanners.qr_scanner import QRScanner
from scanners.screenshot_scanner import ScreenshotScanner
from scanners.transaction_scanner import TransactionScanner
from risk_engine import RiskEngine
from explanation import ExplanationEngine
from services.file_validator import validate_image_file

router = APIRouter()

# Instantiate singletons for scanners & engines
message_scanner = MessageScanner()
url_scanner = URLScanner()
qr_scanner = QRScanner()
screenshot_scanner = ScreenshotScanner()
transaction_scanner = TransactionScanner()
risk_engine = RiskEngine()
explanation_engine = ExplanationEngine()

# Seeded Demo Scenarios matching PRD Section 32
DEMO_SCENARIOS = [
    {
        "id": "scenario-1",
        "title": "Scenario 1: Fake KYC Expiry Warning",
        "type": "message",
        "description": "Urgent SMS claiming immediate UPI block due to expired KYC with phishing link.",
        "payload": {
            "text": "Dear Customer, Your SBI YONO Account KYC has expired. Your UPI service will be blocked today. Verify immediately at https://sbi-kyc-update.online to avoid suspension."
        },
        "expected_result": "HIGH RISK (90-100)"
    },
    {
        "id": "scenario-2",
        "title": "Scenario 2: Fake Refund QR (Claim Intent Mismatch)",
        "type": "qr",
        "description": "Attacker sends QR code claiming 'Scan to receive your refund of ₹5,000'. QR actually executes upi://pay.",
        "context_claim": "Scan this QR to receive refund of ₹5000 directly to your bank account",
        "expected_result": "HIGH RISK (Intent Mismatch: Debits money instead of receiving)"
    },
    {
        "id": "scenario-3",
        "title": "Scenario 3: Typosquatted Banking Domain",
        "type": "url",
        "description": "Phishing portal hosted on a visual homoglyph / typosquatted domain.",
        "payload": {
            "url": "https://bank-examp1e.com/sbi/verify-login?token=89234"
        },
        "expected_result": "HIGH RISK (Typosquatted Domain detected)"
    },
    {
        "id": "scenario-4",
        "title": "Scenario 4: Scam Conversation Screenshot",
        "type": "screenshot",
        "description": "Chat screenshot containing fake lottery prize and urgent payment link.",
        "expected_result": "HIGH RISK (OCR extracts text, analyzes URLs and detects lure)"
    },
    {
        "id": "scenario-5",
        "title": "Scenario 5: Legitimate Bank Confirmation",
        "type": "message",
        "description": "Routine NEFT credit message received from official bank handle.",
        "payload": {
            "text": "Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 on 01-Sep-2026 by NEFT. Bal: Rs 52,140.75 - State Bank of India"
        },
        "expected_result": "SAFE (0-20)"
    },
    {
        "id": "scenario-6",
        "title": "Scenario 6: High-Risk Anomalous Transaction",
        "type": "transaction",
        "description": "Large amount transfer to new recipient at 3:30 AM from unrecognized device.",
        "payload": {
            "amount": 28000.0,
            "receiver": "unknown.hacker88@ybl",
            "timestamp": "2026-09-05T03:30:00Z",
            "device_id": "DEVICE_UNKNOWN_EMULATOR_X",
            "location": "DELHI_NCR",
            "historical_avg_amount": 1200.0
        },
        "expected_result": "HIGH RISK / SUSPICIOUS (Amount > 5x, New Recipient, Unusual Time, Device Change)"
    }
]

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "IRIS — Intelligent Risk & Impersonation Shield",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "modules": {
            "message_scanner": True,
            "url_scanner": True,
            "qr_scanner": True,
            "screenshot_scanner": True,
            "transaction_scanner": True,
            "rule_engine": True,
            "ml_classifier": message_scanner.ml_classifier.is_loaded,
            "threat_intelligence": True,
        }
    }

@router.get("/demo-scenarios")
def get_demo_scenarios():
    return DEMO_SCENARIOS

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return get_stats_summary(db)

@router.post("/analyze/message", response_model=AnalysisResponse)
def analyze_message(req: MessageAnalysisRequest, db: Session = Depends(get_db)):
    signals, entities, meta = message_scanner.analyze(req.text)
    risk_score, classification, primary_cat = risk_engine.calculate_score(signals)
    reasons, actions = explanation_engine.explain(signals, classification)

    response = AnalysisResponse(
        input_type="message",
        risk_score=risk_score,
        classification=classification,
        scam_category=primary_cat,
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities=entities.model_dump(),
        scanner_metadata={"scanner": "message_scanner", **meta},
    )
    save_analysis(db, response, raw_input_ref=req.text)
    return response

@router.post("/analyze/url", response_model=AnalysisResponse)
def analyze_url(req: URLAnalysisRequest, db: Session = Depends(get_db)):
    signals = url_scanner.analyze(req.url)
    risk_score, classification, primary_cat = risk_engine.calculate_score(signals)
    reasons, actions = explanation_engine.explain(signals, classification)

    response = AnalysisResponse(
        input_type="url",
        risk_score=risk_score,
        classification=classification,
        scam_category=primary_cat or ("PHISHING" if risk_score > 30 else None),
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities={"urls": [req.url]},
        scanner_metadata={"scanner": "url_scanner", "target_url": req.url},
    )
    save_analysis(db, response, raw_input_ref=req.url)
    return response

@router.post("/analyze/qr", response_model=AnalysisResponse)
async def analyze_qr(
    file: UploadFile = File(...),
    context_claim: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_bytes = await validate_image_file(file)
    signals, qr_payload = qr_scanner.analyze({"image_bytes": image_bytes, "context_claim": context_claim})
    risk_score, classification, primary_cat = risk_engine.calculate_score(signals)
    reasons, actions = explanation_engine.explain(signals, classification)

    entities = {}
    if qr_payload:
        entities = {
            "payee_vpa": [qr_payload.payee_vpa] if qr_payload.payee_vpa else [],
            "payee_name": [qr_payload.payee_name] if qr_payload.payee_name else [],
            "amounts": [str(qr_payload.amount)] if qr_payload.amount else [],
        }

    response = AnalysisResponse(
        input_type="qr",
        risk_score=risk_score,
        classification=classification,
        scam_category=primary_cat or ("QR_SCAM" if risk_score > 30 else None),
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities=entities,
        scanner_metadata={"scanner": "qr_scanner", "filename": file.filename, "context_claim": context_claim},
        qr_payload=qr_payload,
    )
    save_analysis(db, response, raw_input_ref=f"QR Image: {file.filename} (Claim: {context_claim or 'None'})")
    return response

@router.post("/analyze/screenshot", response_model=AnalysisResponse)
async def analyze_screenshot(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_bytes = await validate_image_file(file)
    signals, entities, qr_payload, meta = screenshot_scanner.analyze(image_bytes)
    risk_score, classification, primary_cat = risk_engine.calculate_score(signals)
    reasons, actions = explanation_engine.explain(signals, classification)

    response = AnalysisResponse(
        input_type="screenshot",
        risk_score=risk_score,
        classification=classification,
        scam_category=primary_cat or ("PHISHING" if risk_score > 30 else None),
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities=entities.model_dump(),
        scanner_metadata={"scanner": "screenshot_scanner", "filename": file.filename, **meta},
        qr_payload=qr_payload,
    )
    save_analysis(db, response, raw_input_ref=f"Screenshot: {file.filename}")
    return response

@router.post("/analyze/transaction", response_model=AnalysisResponse)
def analyze_transaction(req: TransactionAnalysisRequest, db: Session = Depends(get_db)):
    signals = transaction_scanner.analyze(req)
    risk_score, classification, primary_cat = risk_engine.calculate_score(signals)
    reasons, actions = explanation_engine.explain(signals, classification)

    entities = {
        "amounts": [f"₹{req.amount:,.2f}"],
        "upi_ids": [req.receiver],
    }

    response = AnalysisResponse(
        input_type="transaction",
        risk_score=risk_score,
        classification=classification,
        scam_category=primary_cat or ("SUSPICIOUS_TRANSACTION" if risk_score > 30 else None),
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities=entities,
        scanner_metadata={
            "scanner": "transaction_scanner",
            "historical_baseline_mode": "synthetic_demo_profile",
            "amount": req.amount,
            "receiver": req.receiver,
        }
    )
    save_analysis(db, response, raw_input_ref=f"Txn to {req.receiver} of ₹{req.amount}")
    return response

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_unified(req: UnifiedAnalysisRequest, db: Session = Depends(get_db)):
    """
    Unified endpoint with automatic input-type detection.
    """
    if req.transaction_data:
        return analyze_transaction(req.transaction_data, db)

    content = (req.content or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Content or transaction data is required.")

    # Auto-detect URL vs Message
    if content.startswith(("http://", "https://", "www.")) or (len(content.split()) == 1 and "." in content and not "@" in content):
        return analyze_url(URLAnalysisRequest(url=content), db)

    # Fallback to message
    return analyze_message(MessageAnalysisRequest(text=content), db)

@router.get("/analysis/history")
def get_history(limit: int = 20, db: Session = Depends(get_db)):
    records = get_recent_analyses(db, limit=limit)
    return [
        {
            "analysis_id": r.id,
            "input_type": r.input_type,
            "risk_score": r.risk_score,
            "classification": r.classification,
            "scam_category": r.scam_category,
            "sanitized_input_ref": r.sanitized_input_ref,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in records
    ]

@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_detail(analysis_id: str, db: Session = Depends(get_db)):
    record = get_analysis_by_id(db, analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    signals = [
        Signal(
            signal_name=s.signal_name,
            severity=s.severity,
            confidence=s.confidence,
            source=s.source,
        )
        for s in record.signals
    ]

    entities_dict = {}
    for e in record.entities:
        entities_dict.setdefault(e.entity_type, []).append(e.entity_value)

    qr_payload = None
    if record.qr_payload:
        qp = record.qr_payload
        qr_payload = QRPayload(
            payee_vpa=qp.payee_vpa,
            payee_name=qp.payee_name,
            amount=qp.amount,
            currency=qp.currency,
            tx_ref=qp.tx_ref,
            raw_payload=f"upi://pay?pa={qp.payee_vpa or ''}&pn={qp.payee_name or ''}",
            direction="send",
            is_upi=True,
        )

    reasons, actions = explanation_engine.explain(signals, record.classification)

    return AnalysisResponse(
        analysis_id=record.id,
        input_type=record.input_type,
        risk_score=record.risk_score,
        classification=record.classification,
        scam_category=record.scam_category,
        signals=signals,
        reasons=reasons,
        recommended_actions=actions,
        extracted_entities=entities_dict,
        scanner_metadata={"model_version": record.model_version, "rule_version": record.rule_version},
        qr_payload=qr_payload,
        created_at=record.created_at.isoformat() if record.created_at else datetime.utcnow().isoformat(),
    )
