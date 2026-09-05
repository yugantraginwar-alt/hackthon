import os
import sys
import pytest
from fastapi.testclient import TestClient
import qrcode
import io

# Add backend directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
from database import init_db
from scanners.qr_scanner.parser import parse_upi_uri
from scanners.url_scanner.typosquat import check_typosquatting
from risk_engine import RiskEngine

# Initialize database schema for tests
init_db()

client = TestClient(app)

def create_qr_image_bytes(payload: str) -> bytes:
    qr = qrcode.QRCode(box_size=10, border=2)
    qr.add_data(payload)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["modules"]["rule_engine"] is True

def test_demo_scenario_1_fake_kyc():
    """Demo Scenario 1: Fake KYC Message with urgency and link -> HIGH RISK"""
    payload = {
        "text": "Your KYC has expired. Your UPI will be blocked today. Verify immediately using https://sbi-kyc-update.online"
    }
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["classification"] == "HIGH_RISK"
    assert data["risk_score"] >= 75
    assert any("KYC" in r or "urgency" in r.lower() for r in data["reasons"])
    assert len(data["recommended_actions"]) > 0

def test_demo_scenario_2_fake_refund_qr():
    """Demo Scenario 2: Fake Refund QR with claim-intent mismatch -> HIGH RISK"""
    qr_bytes = create_qr_image_bytes("upi://pay?pa=scammer.refund@ybl&pn=RefundDesk&am=5000&cu=INR")
    files = {"file": ("refund_qr.png", qr_bytes, "image/png")}
    data_form = {"context_claim": "Scan this QR to receive refund of 5000"}

    response = client.post("/api/analyze/qr", files=files, data=data_form)
    assert response.status_code == 200
    res = response.json()
    assert res["classification"] == "HIGH_RISK"
    assert any(s["signal_name"] == "CLAIM_INTENT_MISMATCH" for s in res["signals"])
    assert res["qr_payload"]["direction"] == "send"
    assert any("DEBIT" in r or "outgoing" in r.lower() or "mismatch" in r.lower() for r in res["reasons"])

def test_demo_scenario_3_typosquatted_url():
    """Demo Scenario 3: Typosquatted bank domain -> HIGH RISK"""
    response = client.post("/api/analyze/url", json={"url": "https://bank-examp1e.com/sbi/verify-login"})
    assert response.status_code == 200
    data = response.json()
    assert data["classification"] in ("HIGH_RISK", "SUSPICIOUS")
    assert any(s["signal_name"] == "TYPOSQUATTED_DOMAIN" or s["signal_name"] == "KNOWN_MALICIOUS_URL" for s in data["signals"])

def test_demo_scenario_5_legitimate_message():
    """Demo Scenario 5: Legitimate bank confirmation -> SAFE"""
    payload = {
        "text": "Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 on 01-Sep-2026 by NEFT. Bal: Rs 52,140.75 - State Bank of India"
    }
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["classification"] == "SAFE"
    assert data["risk_score"] <= 30

def test_demo_scenario_6_suspicious_transaction():
    """Demo Scenario 6: Suspicious Transaction -> SUSPICIOUS / HIGH RISK"""
    payload = {
        "amount": 28000.0,
        "receiver": "unknown.hacker88@ybl",
        "timestamp": "2026-09-05T03:30:00Z",
        "device_id": "DEVICE_UNKNOWN_EMULATOR_X",
        "location": "DELHI_NCR",
        "historical_avg_amount": 1200.0
    }
    response = client.post("/api/analyze/transaction", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["classification"] in ("SUSPICIOUS", "HIGH_RISK")
    assert any(s["signal_name"] == "AMOUNT_ANOMALY" for s in data["signals"])

def test_qr_parser_direct():
    payload = parse_upi_uri("upi://pay?pa=merchant@okhdfcbank&pn=SuperStore&am=250.50&cu=INR&tr=TXN8912")
    assert payload.is_upi is True
    assert payload.payee_vpa == "merchant@okhdfcbank"
    assert payload.payee_name == "SuperStore"
    assert payload.amount == 250.50
    assert payload.direction == "send"

def test_typosquatting_algorithm():
    is_typo, brand, sim = check_typosquatting("sbi-kyc-portal.com")
    assert is_typo is True
    assert brand == "sbi.co.in"

def test_risk_engine_bounds():
    engine = RiskEngine()
    score, classification, _ = engine.calculate_score([])
    assert score == 0
    assert classification == "SAFE"

def test_history_and_stats_endpoints():
    hist_resp = client.get("/api/analysis/history")
    assert hist_resp.status_code == 200
    assert isinstance(hist_resp.json(), list)

    stats_resp = client.get("/api/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "total_scans" in stats
