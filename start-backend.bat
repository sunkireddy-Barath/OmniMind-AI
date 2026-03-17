@echo off
setlocal EnableDelayedExpansion
title OmniMind AI - Start Backend
color 0A

REM ── Always cd to this bat's directory ───────────────────────────────
cd /d "%~dp0"

echo.
echo  ============================================
echo   OmniMind AI - Start Backend
echo   Multi-Agent Debate + LLM Council
echo  ============================================
echo.

REM ── Sanity checks ───────────────────────────────────────────────────
if not exist "backend\main.py" (
    echo  [ERROR] backend\main.py not found in: %~dp0
    pause & exit /b 1
)

if not exist "backend\venv\Scripts\python.exe" (
    echo  [ERROR] venv not found. Run setup-backend.bat first.
    pause & exit /b 1
)

REM ── Load .env ───────────────────────────────────────────────────────
if exist ".env" (
    echo  [INFO]  Loading .env ...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        set "line=%%A"
        REM Only process lines that look like VAR_NAME (uppercase + underscore, no spaces)
        echo !line! | findstr /r "^[A-Z][A-Z0-9_]*$" >nul 2>&1
        if !errorlevel! equ 0 (
            set "%%A=%%B"
        )
    )
    echo  [OK]    .env loaded
) else (
    echo  [WARN]  No .env found. Run setup-backend.bat to create one.
)

REM ── API key status ───────────────────────────────────────────────────
echo.
echo  ── API Key Status ──────────────────────────────────────────────
call :check_key OPENAI_API_KEY      "OpenAI        (Analyst, Researcher, Finance)"
call :check_key GOOGLE_API_KEY      "Google Gemini (Critic, Strategist, Consensus)"
call :check_key GROQ_API_KEY        "Groq Llama    (Debater, Synthesizer)"
call :check_key TAVILY_API_KEY      "Tavily Search (Research + Debate)"
call :check_key OPENROUTER_API_KEY  "OpenRouter    (Risk Agent - Mixtral)"
call :check_key GEMINI_API_KEY      "Gemini Direct (Strategy Agent - Ravi)"
echo.

REM ── Start server ────────────────────────────────────────────────────
echo  ── Starting Server ─────────────────────────────────────────────
echo  [INFO]  API     →  http://localhost:8000
echo  [INFO]  Docs    →  http://localhost:8000/docs
echo  [INFO]  Council →  http://localhost:8000/api/council/health
echo  [INFO]  Debate  →  http://localhost:8000/api/debate/run
echo.
echo  Press Ctrl+C to stop.
echo  ────────────────────────────────────────────────────────────────
echo.

cd backend
..\backend\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd ..

pause
exit /b 0

:check_key
set "_val=!%~1!"
if "!_val!"=="" (
    echo  [WARN]  %~1 not set  ^|  %~2
) else (
    echo  [OK]    %~1 set      ^|  %~2
)
exit /b 0
