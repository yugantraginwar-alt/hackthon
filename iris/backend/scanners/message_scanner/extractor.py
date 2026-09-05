import re
from typing import Dict, List, Any
from models.schemas import ExtractedEntities

URL_REGEX = re.compile(
    r'(?:https?://|www\.)[a-zA-Z0-9.\-_]+(?:\.[a-zA-Z]{2,10})+(?:/[^\s]*)?',
    re.IGNORECASE
)

UPI_ID_REGEX = re.compile(
    r'\b[a-zA-Z0-9.\-_]{2,64}@(?!example\b|gmail\b|yahoo\b|outlook\b|hotmail\b)[a-zA-Z]{2,64}\b',
    re.IGNORECASE
)

PHONE_REGEX = re.compile(
    r'(?:\+91[\-\s]?)?[6-9]\d{9}\b'
)

AMOUNT_REGEX = re.compile(
    r'(?:₹|rs\.?|inr)\s*[\d,]+(?:\.\d+)?|\b[\d,]+(?:\.\d+)?\s*(?:₹|rs\.?|inr)\b',
    re.IGNORECASE
)

DATE_REGEX = re.compile(
    r'\b\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}\b|\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b',
    re.IGNORECASE
)

def extract_entities(text: str) -> ExtractedEntities:
    """
    Extracts structured entities from raw or normalized text:
    URLs, UPI handles, Indian phone numbers, amounts, and dates.
    """
    urls = URL_REGEX.findall(text)
    upi_ids = UPI_ID_REGEX.findall(text)
    phones = PHONE_REGEX.findall(text)
    amounts = AMOUNT_REGEX.findall(text)
    dates = DATE_REGEX.findall(text)

    # Deduplicate while preserving order
    return ExtractedEntities(
        urls=list(dict.fromkeys(urls)),
        upi_ids=list(dict.fromkeys(upi_ids)),
        phones=list(dict.fromkeys(phones)),
        amounts=list(dict.fromkeys(amounts)),
        dates=list(dict.fromkeys(dates)),
    )
