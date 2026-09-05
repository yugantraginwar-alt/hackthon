import os
import requests
from typing import Optional
from .service import ThreatIntelligenceService, ThreatVerdict

class GoogleSafeBrowsingProvider(ThreatIntelligenceService):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GSB_API_KEY")

    def check_url(self, url: str) -> ThreatVerdict:
        if not self.api_key:
            return ThreatVerdict(
                is_malicious=False,
                confidence=0.0,
                provider="GoogleSafeBrowsing",
                details="API key not configured; skipping lookup."
            )

        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.api_key}"
        payload = {
            "client": {"clientId": "iris-shield", "clientVersion": "1.0.0"},
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}],
            }
        }
        try:
            res = requests.post(endpoint, json=payload, timeout=2.0)
            if res.status_code == 200:
                matches = res.json().get("matches", [])
                if matches:
                    threat_type = matches[0].get("threatType", "MALICIOUS")
                    return ThreatVerdict(
                        is_malicious=True,
                        confidence=0.99,
                        provider="GoogleSafeBrowsing",
                        details=f"Identified by Google Safe Browsing as {threat_type}",
                        threat_type=threat_type
                    )
            return ThreatVerdict(
                is_malicious=False,
                confidence=0.95,
                provider="GoogleSafeBrowsing",
                details="No threats reported by Google Safe Browsing."
            )
        except Exception as e:
            return ThreatVerdict(
                is_malicious=False,
                confidence=0.0,
                provider="GoogleSafeBrowsing",
                details=f"Lookup failed or timed out: {str(e)}"
            )
