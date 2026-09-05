from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    input_type = Column(String(32), nullable=False)
    sanitized_input_ref = Column(Text, nullable=True)
    risk_score = Column(Integer, nullable=False)
    classification = Column(String(32), nullable=False)
    scam_category = Column(String(64), nullable=True)
    model_version = Column(String(32), default="v0.1-demo")
    rule_version = Column(String(32), default="v0.1")
    created_at = Column(DateTime, default=datetime.utcnow)

    signals = relationship("SignalRecord", back_populates="analysis", cascade="all, delete-orphan")
    entities = relationship("ExtractedEntityRecord", back_populates="analysis", cascade="all, delete-orphan")
    qr_payload = relationship("QRPayloadRecord", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class SignalRecord(Base):
    __tablename__ = "signals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    signal_name = Column(String(64), nullable=False)
    severity = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    source = Column(String(32), nullable=False)

    analysis = relationship("AnalysisRecord", back_populates="signals")

class ExtractedEntityRecord(Base):
    __tablename__ = "extracted_entities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    entity_type = Column(String(32), nullable=False)
    entity_value = Column(String(256), nullable=False)

    analysis = relationship("AnalysisRecord", back_populates="entities")

class QRPayloadRecord(Base):
    __tablename__ = "qr_payloads"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id"), nullable=False)
    payee_vpa = Column(String(128), nullable=True)
    payee_name = Column(String(128), nullable=True)
    amount = Column(Float, nullable=True)
    currency = Column(String(16), default="INR")
    tx_ref = Column(String(128), nullable=True)

    analysis = relationship("AnalysisRecord", back_populates="qr_payload")
