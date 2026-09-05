import re
import ipaddress
import requests
from urllib.parse import urlparse
from typing import List, Dict, Any, Optional
from scanners.base import BaseScanner
from models.schemas import Signal
from threat_intelligence import ThreatIntelligenceManager
from .typosquat import check_typosquatting
from threat_intelligence.local_heuristics import SUSPICIOUS_TLDS

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", "ow.ly", "cutt.ly"
}

SENSITIVE_KEYWORDS = [
    "login", "verify", "kyc", "secure", "update", "pay", "bank", "refund", "password", "auth", "credential"
]

class URLScanner(BaseScanner):
    def __init__(self):
        self.threat_manager = ThreatIntelligenceManager()

    def analyze(self, raw_url: str) -> List[Signal]:
        signals: List[Signal] = []
        if not raw_url:
            return signals

        # Normalize URL format
        url = raw_url.strip()
        if not url.startswith(("http://", "https://")):
            url = "http://" + url

        try:
            parsed = urlparse(url)
        except Exception:
            return [Signal(
                signal_name="MALFORMED_URL",
                severity=15,
                confidence=0.90,
                source="URL",
                metadata={"url": raw_url}
            )]

        domain = (parsed.netloc or "").split(":")[0].lower()
        path = (parsed.path or "").lower()
        query = (parsed.query or "").lower()

        # 1. IP Host Check
        try:
            ipaddress.ip_address(domain)
            signals.append(Signal(
                signal_name="IP_HOST_URL",
                severity=30,
                confidence=0.95,
                source="URL",
                metadata={"domain": domain}
            ))
        except ValueError:
            pass  # Normal domain name

        # 2. Punycode check
        if domain.startswith("xn--") or ".xn--" in domain:
            signals.append(Signal(
                signal_name="PUNYCODE_DOMAIN",
                severity=25,
                confidence=0.90,
                source="URL",
                metadata={"domain": domain}
            ))

        # 3. Subdomain count
        subdomains = domain.split(".")
        if len(subdomains) > 3 and not (domain.endswith(".co.in") or domain.endswith(".gov.in")):
            signals.append(Signal(
                signal_name="EXCESSIVE_SUBDOMAINS",
                severity=15,
                confidence=0.80,
                source="URL",
                metadata={"count": len(subdomains), "domain": domain}
            ))

        # 4. Suspicious TLD check
        for tld in SUSPICIOUS_TLDS:
            if domain.endswith(tld):
                signals.append(Signal(
                    signal_name="SUSPICIOUS_TLD",
                    severity=20,
                    confidence=0.85,
                    source="URL",
                    metadata={"tld": tld, "domain": domain}
                ))
                break

        # 5. Shortener & Safe Redirect Resolution (capped HEAD requests, max 2 hops, 2s timeout)
        resolved_url = url
        if any(short in domain for short in SHORTENER_DOMAINS):
            signals.append(Signal(
                signal_name="URL_SHORTENER",
                severity=15,
                confidence=0.90,
                source="URL",
                metadata={"domain": domain}
            ))
            try:
                # Safe isolated HEAD request
                resp = requests.head(url, allow_redirects=True, timeout=2.0)
                if resp.url and resp.url != url:
                    resolved_url = resp.url
                    parsed_res = urlparse(resolved_url)
                    domain = (parsed_res.netloc or "").split(":")[0].lower()
                    path = (parsed_res.path or "").lower()
            except Exception:
                pass  # Do not block if network unreachable

        # 6. Typosquatting Check
        is_typo, brand, sim = check_typosquatting(domain)
        if is_typo:
            signals.append(Signal(
                signal_name="TYPOSQUATTED_DOMAIN",
                severity=35,
                confidence=round(sim, 2),
                source="URL",
                metadata={"mimicked_brand": brand, "domain": domain, "similarity": round(sim, 2)}
            ))

        # 7. Sensitive keywords in path or query
        matched_kw = [kw for kw in SENSITIVE_KEYWORDS if kw in path or kw in query]
        if matched_kw:
            signals.append(Signal(
                signal_name="SENSITIVE_KEYWORD_IN_PATH",
                severity=20,
                confidence=0.85,
                source="URL",
                metadata={"keywords": matched_kw, "path": path}
            ))

        # 8. Structural density metrics
        special_char_count = len(re.findall(r'[^a-zA-Z0-9]', url))
        digit_count = sum(c.isdigit() for c in url)
        if len(url) > 100 or (special_char_count / max(len(url), 1) > 0.35) or (digit_count / max(len(url), 1) > 0.25):
            signals.append(Signal(
                signal_name="HIGH_URL_ENTROPY",
                severity=15,
                confidence=0.75,
                source="URL",
                metadata={"length": len(url), "digits": digit_count}
            ))

        # 9. Threat Intelligence Provider Lookup
        threat_verdict = self.threat_manager.check_url(resolved_url)
        if threat_verdict.is_malicious:
            signals.append(Signal(
                signal_name="KNOWN_MALICIOUS_URL",
                severity=45,
                confidence=threat_verdict.confidence,
                source="THREAT_INTEL",
                metadata={
                    "provider": threat_verdict.provider,
                    "threat_type": threat_verdict.threat_type,
                    "details": threat_verdict.details,
                }
            ))

        return signals
