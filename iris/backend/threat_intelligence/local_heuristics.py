from urllib.parse import urlparse
from .service import ThreatIntelligenceService, ThreatVerdict

KNOWN_MALICIOUS_DOMAINS = {
    "sbi-kyc-update.online",
    "hdfc-verify-kyc.top",
    "paytm-kyc-fix.cc",
    "icici-portal-kyc.in",
    "axis-kyc-renewal.site",
    "gpay-refunds.xyz",
    "phonepe-rewards.live",
    "secure-bank-login.com",
    "incometax-efiling-refund.vip",
    "netflix-billing-update.cc",
    "lucky-draw-winner.biz",
    "echallan-parivahan-pay.me",
    "bank-examp1e.com",
    "sbi-otp-auth.com",
}

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".site", ".cc", ".vip", ".buzz", ".work", ".click", ".kim", ".fit", ".gq", ".cf", ".tk", ".ml"
}

class LocalHeuristicProvider(ThreatIntelligenceService):
    """
    Always-available offline local heuristic threat intelligence provider.
    Ensures zero external dependency downtime during hackathon evaluation.
    """
    def check_url(self, url: str) -> ThreatVerdict:
        try:
            parsed = urlparse(url if "://" in url else f"http://{url}")
            domain = (parsed.netloc or parsed.path).split(":")[0].lower()
            
            # 1. Exact match against known malicious domains
            if domain in KNOWN_MALICIOUS_DOMAINS:
                return ThreatVerdict(
                    is_malicious=True,
                    confidence=0.98,
                    provider="LocalHeuristicProvider",
                    details=f"Domain {domain} is flagged in threat heuristics database.",
                    threat_type="CONFIRMED_MALICIOUS_DOMAIN"
                )

            # 2. Check for suspicious TLDs
            for tld in SUSPICIOUS_TLDS:
                if domain.endswith(tld):
                    return ThreatVerdict(
                        is_malicious=True,
                        confidence=0.75,
                        provider="LocalHeuristicProvider",
                        details=f"Domain uses high-abuse top-level domain: {tld}",
                        threat_type="HIGH_RISK_TLD"
                    )

            # 3. Check for obvious phishing combos in domain name
            keywords = ["kyc", "otp", "verify", "secure", "bank", "refund", "login", "claim"]
            count = sum(1 for k in keywords if k in domain)
            if count >= 2:
                return ThreatVerdict(
                    is_malicious=True,
                    confidence=0.85,
                    provider="LocalHeuristicProvider",
                    details="Domain name contains multiple high-risk banking phishing keywords.",
                    threat_type="SUSPICIOUS_PHISHING_DOMAIN"
                )

            return ThreatVerdict(
                is_malicious=False,
                confidence=0.90,
                provider="LocalHeuristicProvider",
                details="No local malicious indicators detected."
            )
        except Exception as e:
            return ThreatVerdict(
                is_malicious=False,
                confidence=0.5,
                provider="LocalHeuristicProvider",
                details=f"Heuristic parse note: {str(e)}"
            )
