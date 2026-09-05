from typing import List, Optional
from .service import ThreatIntelligenceService, ThreatVerdict
from .local_heuristics import LocalHeuristicProvider
from .google_safe_browsing import GoogleSafeBrowsingProvider

class ThreatIntelligenceManager:
    def __init__(self):
        self.providers: List[ThreatIntelligenceService] = [
            GoogleSafeBrowsingProvider(),
            LocalHeuristicProvider(),
        ]

    def check_url(self, url: str) -> ThreatVerdict:
        """
        Runs configured providers in sequence.
        Returns the first conclusive malicious verdict or falls back to local heuristic.
        """
        fallback_verdict: Optional[ThreatVerdict] = None
        for provider in self.providers:
            try:
                verdict = provider.check_url(url)
                if verdict.is_malicious:
                    return verdict
                if isinstance(provider, LocalHeuristicProvider):
                    fallback_verdict = verdict
            except Exception as e:
                print(f"Provider {provider.__class__.__name__} check failed: {e}")

        return fallback_verdict or ThreatVerdict(
            is_malicious=False,
            confidence=0.5,
            provider="DefaultFallback",
            details="Threat check completed with no malicious findings."
        )
