import os
import yaml
from typing import List, Dict, Any, Optional
from models.schemas import Signal

class RuleEvaluator:
    def __init__(self, rules_path: Optional[str] = None):
        if not rules_path:
            rules_path = os.path.join(os.path.dirname(__file__), "rules.yaml")
        self.rules_path = rules_path
        self.rules = self._load_rules()

    def _load_rules(self) -> List[Dict[str, Any]]:
        try:
            with open(self.rules_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                return data.get("rules", [])
        except Exception as e:
            print(f"Warning: Failed to load rules.yaml: {e}")
            return []

    def evaluate_text(self, normalized_text: str) -> List[Signal]:
        signals: List[Signal] = []
        text_lower = normalized_text.lower()

        for rule in self.rules:
            # 1. match_all_groups condition
            if "match_all_groups" in rule:
                groups = rule["match_all_groups"]
                match = True
                for grp in groups:
                    if not any(k in text_lower for k in grp):
                        match = False
                        break
                if match:
                    signals.append(Signal(
                        signal_name=rule["signal"],
                        severity=rule["severity"],
                        confidence=rule["confidence"],
                        source="RULE",
                        metadata={"rule_id": rule["id"], "category": rule.get("category")}
                    ))
                continue

            # 2. simple keywords condition
            if "keywords" in rule:
                matched_kw = [k for k in rule["keywords"] if k in text_lower]
                if matched_kw:
                    signals.append(Signal(
                        signal_name=rule["signal"],
                        severity=rule["severity"],
                        confidence=rule["confidence"],
                        source="RULE",
                        metadata={"rule_id": rule["id"], "matched": matched_kw, "category": rule.get("category")}
                    ))

        return signals

    def get_rule_by_signal(self, signal_name: str) -> Optional[Dict[str, Any]]:
        for r in self.rules:
            if r.get("signal") == signal_name:
                return r
        return None
