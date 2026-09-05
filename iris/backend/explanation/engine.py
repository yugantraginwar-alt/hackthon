from typing import List, Tuple
from models.schemas import Signal
from .mappings import SIGNAL_EXPLANATIONS, SIGNAL_ACTIONS

class ExplanationEngine:
    def __init__(self):
        pass

    def explain(self, signals: List[Signal], classification: str) -> Tuple[List[str], List[str]]:
        """
        Translates raw signals into human-understandable reasons and actions.
        Returns: (reasons, recommended_actions)
        """
        reasons: List[str] = []
        actions: List[str] = []

        if classification == "SAFE" and not any(s.severity > 15 for s in signals):
            return [
                "No known fraud patterns, credential requests, or suspicious links were detected."
            ], [
                "Proceed with standard security vigilance.",
                "Always verify recipient details before entering your UPI PIN."
            ]

        # Order signals by severity descending
        sorted_signals = sorted(signals, key=lambda s: (s.severity, s.confidence), reverse=True)

        for s in sorted_signals:
            if s.signal_name in SIGNAL_EXPLANATIONS:
                explanation = SIGNAL_EXPLANATIONS[s.signal_name]
                # If custom metadata detail is available, augment it
                if s.metadata and "mimicked_brand" in s.metadata:
                    explanation += f" (Specifically targeting {s.metadata['mimicked_brand'].upper()})."
                elif s.metadata and "user_claim" in s.metadata:
                    explanation += f" (Context claimed: '{s.metadata['user_claim']}')."

                if explanation not in reasons:
                    reasons.append(explanation)

            if s.signal_name in SIGNAL_ACTIONS:
                act = SIGNAL_ACTIONS[s.signal_name]
                if act not in actions:
                    actions.append(act)

        # Ensure sensible fallbacks if empty
        if not reasons:
            reasons = ["Low confidence risk indicators detected. Exercise caution."]
        if not actions:
            actions = ["Verify recipient identity independently before authorizing any transaction."]

        return reasons, actions
