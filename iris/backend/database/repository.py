from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from .models import AnalysisRecord, SignalRecord, ExtractedEntityRecord, QRPayloadRecord
from models.schemas import AnalysisResponse, Signal, QRPayload
from services.sanitizer import sanitize_text

def save_analysis(db: Session, response: AnalysisResponse, raw_input_ref: Optional[str] = None) -> AnalysisRecord:
    sanitized_input = sanitize_text(raw_input_ref) if raw_input_ref else None

    record = AnalysisRecord(
        id=response.analysis_id,
        input_type=response.input_type,
        sanitized_input_ref=sanitized_input,
        risk_score=response.risk_score,
        classification=response.classification,
        scam_category=response.scam_category,
        model_version=response.scanner_metadata.get("model_version", "v0.1-demo"),
        rule_version=response.scanner_metadata.get("rule_version", "v0.1"),
    )
    db.add(record)

    # Add signals
    for s in response.signals:
        sig_rec = SignalRecord(
            analysis_id=response.analysis_id,
            signal_name=s.signal_name,
            severity=s.severity,
            confidence=s.confidence,
            source=s.source,
        )
        db.add(sig_rec)

    # Add extracted entities
    for etype, values in response.extracted_entities.items():
        if isinstance(values, list):
            for val in values:
                db.add(ExtractedEntityRecord(
                    analysis_id=response.analysis_id,
                    entity_type=etype,
                    entity_value=str(val),
                ))

    # Add QR payload if present
    if response.qr_payload:
        qp = response.qr_payload
        db.add(QRPayloadRecord(
            analysis_id=response.analysis_id,
            payee_vpa=qp.payee_vpa,
            payee_name=qp.payee_name,
            amount=qp.amount,
            currency=qp.currency,
            tx_ref=qp.tx_ref,
        ))

    db.commit()
    db.refresh(record)
    return record

def get_analysis_by_id(db: Session, analysis_id: str) -> Optional[AnalysisRecord]:
    return db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()

def get_recent_analyses(db: Session, limit: int = 20) -> List[AnalysisRecord]:
    return db.query(AnalysisRecord).order_by(desc(AnalysisRecord.created_at)).limit(limit).all()

def get_stats_summary(db: Session) -> Dict[str, Any]:
    total_scans = db.query(func.count(AnalysisRecord.id)).scalar() or 0
    safe_count = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.classification == "SAFE").scalar() or 0
    suspicious_count = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.classification == "SUSPICIOUS").scalar() or 0
    high_risk_count = db.query(func.count(AnalysisRecord.id)).filter(AnalysisRecord.classification == "HIGH_RISK").scalar() or 0

    # Top categories
    cat_counts = (
        db.query(AnalysisRecord.scam_category, func.count(AnalysisRecord.id))
        .filter(AnalysisRecord.scam_category.isnot(None))
        .group_by(AnalysisRecord.scam_category)
        .order_by(desc(func.count(AnalysisRecord.id)))
        .limit(5)
        .all()
    )
    top_categories = {cat: count for cat, count in cat_counts}

    recent_records = get_recent_analyses(db, limit=5)
    recent_scans = [
        {
            "id": r.id,
            "input_type": r.input_type,
            "risk_score": r.risk_score,
            "classification": r.classification,
            "scam_category": r.scam_category,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in recent_records
    ]

    return {
        "total_scans": total_scans,
        "safe_count": safe_count,
        "suspicious_count": suspicious_count,
        "high_risk_count": high_risk_count,
        "top_categories": top_categories,
        "recent_scans": recent_scans,
    }
