from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List


@dataclass
class PersonaValidationResult:
    persona: str
    valid: bool
    missing: List[str] = field(default_factory=list)

    @property
    def marker(self) -> str:
        if self.valid:
            return ""
        missing = ", ".join(self.missing)
        return f"[VALIDATION_FAILED persona={self.persona} missing={missing}]"


_PERSONA_ALIASES = {
    "research": "priya",
    "risk": "arjun",
    "finance": "kavya",
    "strategy": "ravi",
    "policy": "meera",
    "priya": "priya",
    "arjun": "arjun",
    "kavya": "kavya",
    "ravi": "ravi",
    "meera": "meera",
}


def _has_confidence(text: str) -> bool:
    return bool(re.search(r"\bconfidence\b\s*[:\-]", text, re.IGNORECASE))


def _has_data_gaps(text: str) -> bool:
    return bool(
        re.search(
            r"\bdata\s+gaps?\b|\bgaps?\s+identified\b|\bunknowns?\b",
            text,
            re.IGNORECASE,
        )
    )


def _has_risk_tiers(text: str) -> bool:
    needed = [
        re.search(r"\bcritical\s+risks?\b", text, re.IGNORECASE),
        re.search(r"\bmanageable\s+risks?\b", text, re.IGNORECASE),
        re.search(r"\bacceptable\s+risks?\b", text, re.IGNORECASE),
    ]
    return all(needed)


def _has_rupee_table(text: str) -> bool:
    has_table = "|" in text and re.search(r"\n\|.*\|\n\|\s*[-:]+", text) is not None
    has_rupee = bool(re.search(r"\bRs\.?\b|₹", text))
    has_required_fields = all(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in [
            r"total\s+investment",
            r"monthly\s+operational\s+costs?",
            r"break[-\s]?even",
            r"3[-\s]?year\s+roi",
        ]
    )
    return has_table and has_rupee and has_required_fields


def _has_phased_roadmap(text: str) -> bool:
    return all(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in [
            r"phase\s*1\s*\(\s*0\s*-\s*30\s+days\s*\)",
            r"phase\s*2\s*\(\s*31\s*-\s*90\s+days\s*\)",
            r"phase\s*3\s*\(\s*91\s*-\s*180\s+days\s*\)",
        ]
    )


def _has_scheme_deadline_docs(text: str) -> bool:
    has_scheme = bool(re.search(r"\bscheme(s)?\b", text, re.IGNORECASE))
    has_deadline = bool(re.search(r"\bdeadline(s)?\b", text, re.IGNORECASE))
    has_docs = bool(re.search(r"\bdocuments?\b|\bdocs\b", text, re.IGNORECASE))
    return has_scheme and has_deadline and has_docs


def validate_persona_output(persona: str, text: str) -> PersonaValidationResult:
    canonical = _PERSONA_ALIASES.get(persona.lower(), persona.lower())
    missing: List[str] = []

    if canonical == "priya":
        if not _has_confidence(text):
            missing.append("confidence")
        if not _has_data_gaps(text):
            missing.append("data_gaps")
    elif canonical == "arjun":
        if not _has_risk_tiers(text):
            missing.append("critical/manageable/acceptable_risk_tiers")
    elif canonical == "kavya":
        if not _has_rupee_table(text):
            missing.append(
                "rupee_table(total_investment,monthly_cost,break_even,3_year_roi)"
            )
    elif canonical == "ravi":
        if not _has_phased_roadmap(text):
            missing.append("phase_1_0_30_phase_2_31_90_phase_3_91_180")
    elif canonical == "meera":
        if not _has_scheme_deadline_docs(text):
            missing.append("scheme+deadline+documents")

    return PersonaValidationResult(
        persona=canonical, valid=len(missing) == 0, missing=missing
    )
