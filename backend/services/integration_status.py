from __future__ import annotations

import os


def _is_set(name: str) -> bool:
    return bool(os.getenv(name, "").strip())


def get_integration_status() -> dict:
    """
    Lightweight status map used by the UI status bar and demo flows.

    These checks are intentionally env-based so the feature works without
    forcing a hard dependency on each external SDK at startup.
    """
    gmail = _is_set("GMAIL_CLIENT_ID") and _is_set("GMAIL_CLIENT_SECRET")
    calendar = _is_set("GOOGLE_CALENDAR_CLIENT_ID") and _is_set(
        "GOOGLE_CALENDAR_CLIENT_SECRET"
    )

    # Accept either explicit Airia vars or legacy Gradient fallback var.
    airia = _is_set("AIRIA_API_KEY") or _is_set("GRADIENT_API_KEY")

    return {
        "airia": {"connected": airia, "label": "Airia"},
        "gmail": {"connected": gmail, "label": "Gmail"},
        "calendar": {"connected": calendar, "label": "Google Calendar"},
    }
