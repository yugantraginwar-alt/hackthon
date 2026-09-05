from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from pydantic import BaseModel

class ThreatVerdict(BaseModel):
    is_malicious: bool
    confidence: float
    provider: str
    details: Optional[str] = None
    threat_type: Optional[str] = None

class ThreatIntelligenceService(ABC):
    @abstractmethod
    def check_url(self, url: str) -> ThreatVerdict:
        """Check URL against threat intelligence provider."""
        pass
