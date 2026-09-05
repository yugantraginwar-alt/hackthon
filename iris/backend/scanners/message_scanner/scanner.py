import re
from typing import List, Tuple, Dict, Any, Optional
from scanners.base import BaseScanner
from models.schemas import Signal, ExtractedEntities
from rules import RuleEvaluator
from ml import MLTextClassifier
from scanners.url_scanner import URLScanner
from .extractor import extract_entities

class MessageScanner(BaseScanner):
    def __init__(self):
        self.rule_evaluator = RuleEvaluator()
        self.ml_classifier = MLTextClassifier()
        self.url_scanner = URLScanner()

    def normalize(self, text: str) -> str:
        if not text:
            return ""
        # Collapse excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Strip control characters
        text = "".join(ch for ch in text if ch.isprintable() or ch == ' ')
        return text.strip()

    def analyze(self, raw_text: str) -> Tuple[List[Signal], ExtractedEntities, Dict[str, Any]]:
        signals: List[Signal] = []
        normalized_text = self.normalize(raw_text)

        if not normalized_text:
            return signals, ExtractedEntities(), {}

        # 1. Entity Extraction
        entities = extract_entities(normalized_text)

        # 2. Rule Evaluation
        rule_signals = self.rule_evaluator.evaluate_text(normalized_text)
        signals.extend(rule_signals)

        # 3. ML Model Classification
        ml_signal = self.ml_classifier.get_signal(normalized_text)
        if ml_signal:
            signals.append(ml_signal)

        # 4. Nested URL Scanning if URLs were found
        nested_url_signals: List[Signal] = []
        if entities.urls:
            # Mark suspicious link present
            signals.append(Signal(
                signal_name="SUSPICIOUS_LINK_PRESENT",
                severity=20,
                confidence=0.90,
                source="NLP",
                metadata={"urls": entities.urls}
            ))

            # Run nested scanner on each extracted URL
            for u in entities.urls[:3]:  # Analyze up to first 3 URLs
                sub_sigs = self.url_scanner.analyze(u)
                nested_url_signals.extend(sub_sigs)

        # Deduplicate signals by signal_name, keeping higher severity
        deduped_signals: Dict[str, Signal] = {}
        for s in signals + nested_url_signals:
            if s.signal_name not in deduped_signals:
                deduped_signals[s.signal_name] = s
            else:
                existing = deduped_signals[s.signal_name]
                if s.severity > existing.severity or (s.severity == existing.severity and s.confidence > existing.confidence):
                    deduped_signals[s.signal_name] = s

        final_signals = list(deduped_signals.values())

        metadata = {
            "char_count": len(normalized_text),
            "url_count": len(entities.urls),
            "phone_count": len(entities.phones),
            "amount_count": len(entities.amounts),
            "ml_active": self.ml_classifier.is_loaded,
        }

        return final_signals, entities, metadata
