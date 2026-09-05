from urllib.parse import urlparse, parse_qs
from typing import Optional, Dict, Any
from models.schemas import QRPayload

VERIFIED_MERCHANT_HANDLES = {
    "billdesk", "razorpay", "paytm", "icici", "okhdfcbank", "okaxis", "airtel", "axisbank", "sbi"
}

def parse_upi_uri(uri: str) -> Optional[QRPayload]:
    """
    Parses a UPI URI string (e.g. upi://pay?pa=...&pn=...&am=...) into a structured QRPayload.
    """
    clean_uri = uri.strip()
    if not clean_uri.lower().startswith("upi://pay"):
        # Not a standard UPI payment QR code
        return QRPayload(
            raw_payload=clean_uri,
            is_upi=False,
            direction="unknown"
        )

    parsed = urlparse(clean_uri)
    params = parse_qs(parsed.query)

    pa = params.get("pa", [None])[0]
    pn = params.get("pn", [None])[0]
    am_str = params.get("am", [None])[0]
    cu = params.get("cu", ["INR"])[0]
    tr = params.get("tr", [None])[0]
    mc = params.get("mc", [None])[0]

    amount = None
    if am_str:
        try:
            amount = float(am_str)
        except ValueError:
            amount = None

    return QRPayload(
        payee_vpa=pa,
        payee_name=pn,
        amount=amount,
        currency=cu,
        tx_ref=tr,
        mcc=mc,
        raw_payload=clean_uri,
        direction="send",  # Standard UPI pay protocol ALWAYS initiates an outgoing transfer from the scanner
        is_upi=True
    )

def is_verified_merchant_handle(vpa: Optional[str]) -> bool:
    if not vpa or "@" not in vpa:
        return False
    handle = vpa.split("@")[1].lower()
    return handle in VERIFIED_MERCHANT_HANDLES
