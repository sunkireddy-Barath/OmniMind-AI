from __future__ import annotations

import asyncio
import json
import os
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from typing import Any
from urllib import request as urlrequest

from models.schemas import QueryResponse


class IntegrationExecutionError(RuntimeError):
    pass


def _latest_gate_decision(snapshot: QueryResponse, gate: str) -> bool | None:
    decisions = snapshot.context.get("hitl_decisions") or []
    for decision in reversed(decisions):
        if decision.get("gate") == gate:
            return bool(decision.get("approved"))
    return None


def _summary_text(snapshot: QueryResponse) -> str:
    if snapshot.consensus and snapshot.consensus.analysis:
        return snapshot.consensus.analysis
    if snapshot.simulation and snapshot.simulation.recommended_scenario:
        return f"Recommended scenario: {snapshot.simulation.recommended_scenario}"
    return "Decision run completed."


def _build_email(snapshot: QueryResponse, to_email: str) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"OmniMind Decision Update: {snapshot.query[:70]}"
    msg["From"] = os.getenv("GMAIL_SMTP_USER", "omnimind@localhost")
    msg["To"] = to_email
    msg.set_content(
        "\n".join(
            [
                "OmniMind decision workflow completed.",
                "",
                f"Query: {snapshot.query}",
                "",
                "Summary:",
                _summary_text(snapshot),
            ]
        )
    )
    return msg


async def _send_smtp_email(msg: EmailMessage) -> None:
    host = os.getenv("GMAIL_SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("GMAIL_SMTP_PORT", "587"))
    user = os.getenv("GMAIL_SMTP_USER", "")
    password = os.getenv("GMAIL_SMTP_PASSWORD", "")

    if not user or not password:
        raise IntegrationExecutionError("SMTP credentials not configured")

    def _send() -> None:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)

    await asyncio.to_thread(_send)


async def _post_json(
    url: str, payload: dict[str, Any], headers: dict[str, str] | None = None
) -> dict[str, Any]:
    def _send() -> dict[str, Any]:
        body = json.dumps(payload).encode("utf-8")
        req = urlrequest.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json", **(headers or {})},
            method="POST",
        )
        with urlrequest.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode("utf-8").strip()
            if not raw:
                return {}
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                return {"raw": raw}

    return await asyncio.to_thread(_send)


async def _gmail_action(snapshot: QueryResponse, payload: dict[str, Any]) -> dict[str, Any]:
    approved = _latest_gate_decision(snapshot, "debate_approval")
    if approved is not True:
        raise IntegrationExecutionError(
            "HITL gate 'debate_approval' must be approved before Gmail action"
        )

    to_email = payload.get("to") or os.getenv("OMNIMIND_REPORT_EMAIL") or ""
    if not to_email:
        return {
            "status": "dry_run",
            "message": "No recipient configured. Set payload.to or OMNIMIND_REPORT_EMAIL.",
            "preview": _summary_text(snapshot),
        }

    webhook = os.getenv("GMAIL_WEBHOOK_URL", "")
    if webhook:
        body = {
            "to": to_email,
            "subject": f"OmniMind Decision Update: {snapshot.query[:70]}",
            "summary": _summary_text(snapshot),
            "query_id": snapshot.id,
        }
        await _post_json(webhook, body)
        return {"status": "executed", "transport": "webhook", "to": to_email}

    msg = _build_email(snapshot, to_email)
    try:
        await _send_smtp_email(msg)
        return {"status": "executed", "transport": "smtp", "to": to_email}
    except IntegrationExecutionError:
        return {
            "status": "dry_run",
            "message": "SMTP/webhook unavailable; generated an email draft payload only.",
            "to": to_email,
            "subject": msg["Subject"],
            "body": msg.get_content(),
        }


async def _calendar_action(snapshot: QueryResponse, payload: dict[str, Any]) -> dict[str, Any]:
    approved = _latest_gate_decision(snapshot, "calendar_approval")
    if approved is not True:
        raise IntegrationExecutionError(
            "HITL gate 'calendar_approval' must be approved before Calendar action"
        )

    now = datetime.utcnow() + timedelta(days=1)
    start = payload.get("start") or now.replace(hour=9, minute=0, second=0, microsecond=0).isoformat() + "Z"
    end = payload.get("end") or now.replace(hour=9, minute=30, second=0, microsecond=0).isoformat() + "Z"
    title = payload.get("title") or "OmniMind Decision Review"

    event_body = {
        "summary": title,
        "description": _summary_text(snapshot),
        "start": {"dateTime": start},
        "end": {"dateTime": end},
    }

    webhook = os.getenv("GOOGLE_CALENDAR_WEBHOOK_URL", "")
    if webhook:
        await _post_json(webhook, event_body)
        return {"status": "executed", "transport": "webhook", "event": event_body}

    token = os.getenv("GOOGLE_CALENDAR_ACCESS_TOKEN", "")
    calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
    if token:
        url = f"https://www.googleapis.com/calendar/v3/calendars/{calendar_id}/events"
        headers = {
            "Authorization": f"Bearer {token}",
        }
        data = await _post_json(url, event_body, headers=headers)
        return {
            "status": "executed",
            "transport": "google_api",
            "event_id": data.get("id"),
            "html_link": data.get("htmlLink"),
        }

    return {
        "status": "dry_run",
        "message": "Calendar webhook/token not configured; generated event payload only.",
        "event": event_body,
    }


async def execute_integrations(
    snapshot: QueryResponse,
    actions: list[str] | None = None,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    requested = actions or ["gmail", "calendar"]
    body = payload or {}

    results: dict[str, Any] = {}
    for action in requested:
        try:
            if action == "gmail":
                results[action] = await _gmail_action(snapshot, body.get("gmail", {}))
            elif action == "calendar":
                results[action] = await _calendar_action(snapshot, body.get("calendar", {}))
            else:
                results[action] = {
                    "status": "skipped",
                    "message": f"Unknown integration action: {action}",
                }
        except IntegrationExecutionError as exc:
            results[action] = {"status": "blocked", "message": str(exc)}
        except Exception as exc:  # pragma: no cover
            results[action] = {"status": "failed", "message": str(exc)}

    return results
