from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone
import uuid

class Signal(BaseModel):
    signal_name: str
    severity: int = Field(ge=0, le=50, description="Severity points contributed by this signal")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence in this signal (0.0 to 1.0)")
    source: str = Field(description="Scanner source e.g. NLP, URL, QR, OCR, TXN, RULE, ML")
    metadata: Optional[Dict[str, Any]] = None

class ExtractedEntities(BaseModel):
    urls: List[str] = []
    upi_ids: List[str] = []
    amounts: List[str] = []
    phones: List[str] = []
    dates: List[str] = []

class QRPayload(BaseModel):
    payee_vpa: Optional[str] = None
    payee_name: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = "INR"
    tx_ref: Optional[str] = None
    mcc: Optional[str] = None
    raw_payload: str
    direction: str = "send"
    is_upi: bool = True

class MessageAnalysisRequest(BaseModel):
    text: str

class URLAnalysisRequest(BaseModel):
    url: str

class TransactionAnalysisRequest(BaseModel):
    amount: float
    receiver: str
    timestamp: Optional[str] = None
    device_id: Optional[str] = None
    location: Optional[str] = None
    historical_avg_amount: Optional[float] = 1500.0

class UnifiedAnalysisRequest(BaseModel):
    input_type: Optional[str] = None  # message, url, transaction, qr, screenshot
    content: Optional[str] = None
    transaction_data: Optional[TransactionAnalysisRequest] = None
    context_claim: Optional[str] = None

class AnalysisResponse(BaseModel):
    analysis_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    input_type: str
    risk_score: int = Field(ge=0, le=100)
    classification: str  # SAFE, SUSPICIOUS, HIGH_RISK
    scam_category: Optional[str] = None
    signals: List[Signal] = []
    reasons: List[str] = []
    recommended_actions: List[str] = []
    extracted_entities: Dict[str, Any] = {}
    scanner_metadata: Dict[str, Any] = {}
    qr_payload: Optional[QRPayload] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StatsSummary(BaseModel):
    total_scans: int
    safe_count: int
    suspicious_count: int
    high_risk_count: int
    top_categories: Dict[str, int]
    recent_scans: List[Dict[str, Any]]
