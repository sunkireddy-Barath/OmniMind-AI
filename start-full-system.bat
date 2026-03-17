@echo off
setlocal EnableDelayedExpansion
title OmniMind AI - Full System
color 0A
cd /d "%~dp0"

echo.
echo  ============================================================
echo   OmniMind AI - Full System Launcher
echo   Backend (FastAPI) + Frontend (Next.js)
echo  ============================================================
echo.

REM ════════════════════════════════════════════════════════════════
REM  PRE-FLIGHT CHECKS
REM ════════════════════════════════════════════════════════════════

REM ── Check backend files ─────────────────────────────────────────
if not exist "backend\main.py" (
    echo  [ERROR] backend\main.py not found.
    pause & exit /b 1
)

REM ── Check frontend files ────────────────────────────────────────
if not exist "frontend\package.json" (
    echo  [ERROR] frontend\package.json not found.
    pause & exit /b 1
)

REM ── Check Python ────────────────────────────────────────────────
python3 --version >nul 2>&1
if %errorlevel% equ 0 ( set PYTHON=python3 ) else ( set PYTHON=python )
%PYTHON% --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python not found. Install from https://python.org
    pause & exit /b 1
)

REM ── Check Node ──────────────────────────────────────────────────
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)

echo  [OK]    Python found
echo  [OK]    Node.js found

REM ════════════════════════════════════════════════════════════════
REM  .ENV SETUP
REM ════════════════════════════════════════════════════════════════
if exist ".env" (
    echo  [OK]    .env found
) else (
    if exist ".env.example" (
        echo  [INFO]  Copying .env.example → .env ...
        copy ".env.example" ".env" >nul
        echo  [WARN]  .env created — add your API keys then re-run this bat.
        notepad ".env"
        pause & exit /b 0
    ) else (
        echo  [WARN]  No .env found — API keys will be missing.
    )
)

REM ── Load .env into environment ──────────────────────────────────
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    set "line=%%A"
    echo !line! | findstr /r "^[A-Z][A-Z0-9_]*$" >nul 2>&1
    if !errorlevel! equ 0 set "%%A=%%B"
)

REM ════════════════════════════════════════════════════════════════
REM  BACKEND SETUP (venv + deps) — only if venv missing
REM ════════════════════════════════════════════════════════════════
echo.
echo  ── Backend Setup ───────────────────────────────────────────────

if not exist "backend\venv\Scripts\python.exe" (
    echo  [INFO]  venv not found — running first-time setup ...
    echo  [INFO]  This may take 3-5 minutes ...
    echo.

    %PYTHON% -m venv backend\venv
    if %errorlevel% neq 0 (
        echo  [ERROR] Failed to create venv.
        pause & exit /b 1
    )

    set VENV_PY=backend\venv\Scripts\python.exe

    !VENV_PY! -m pip install --quiet --upgrade pip

    echo  [INFO]  Installing from requirements.txt ...
    !VENV_PY! -m pip install --quiet -r requirements.txt
    if %errorlevel% neq 0 (
        echo  [WARN]  requirements.txt install had errors — installing core packages ...
        !VENV_PY! -m pip install --quiet ^
            fastapi "uvicorn[standard]" "pydantic>=2.8.2" pydantic-settings ^
            python-dotenv python-multipart aiofiles httpx ^
            langchain langchain-openai langchain-community ^
            langchain-google-genai langchain-groq langchain-tavily ^
            openai groq google-generativeai tavily-python ^
            "sqlalchemy[asyncio]" aiosqlite asyncpg ^
            redis aioredis sentence-transformers numpy tiktoken
    )

    echo  [OK]    Backend dependencies installed
) else (
    echo  [OK]    venv exists — skipping install
)

set VENV_PY=backend\venv\Scripts\python.exe

REM ════════════════════════════════════════════════════════════════
REM  FRONTEND SETUP — only if node_modules missing
REM ════════════════════════════════════════════════════════════════
echo.
echo  ── Frontend Setup ──────────────────────────────────────────────

if not exist "frontend\node_modules" (
    echo  [INFO]  node_modules not found — running npm install ...
    cd frontend
    npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed.
        cd ..
        pause & exit /b 1
    )
    cd ..
    echo  [OK]    Frontend dependencies installed
) else (
    echo  [OK]    node_modules exists — skipping install
)

REM ── Create frontend .env.local if missing ───────────────────────
if not exist "frontend\.env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > "frontend\.env.local"
    echo  [OK]    Created frontend\.env.local
)

REM ════════════════════════════════════════════════════════════════
REM  API KEY STATUS
REM ════════════════════════════════════════════════════════════════
echo.
echo  ── API Key Status ──────────────────────────────────────────────
call :check_key OPENAI_API_KEY      "OpenAI        (Analyst, Researcher, Finance)"
call :check_key GOOGLE_API_KEY      "Google Gemini (Critic, Strategist)"
call :check_key GEMINI_API_KEY      "Gemini Direct (Strategy Agent - Ravi)"
call :check_key GROQ_API_KEY        "Groq Llama    (Debater, Synthesizer)"
call :check_key TAVILY_API_KEY      "Tavily Search (Research + Debate)"
call :check_key OPENROUTER_API_KEY  "OpenRouter    (Risk Agent - Mixtral)"

REM ════════════════════════════════════════════════════════════════
REM  LAUNCH BACKEND + FRONTEND IN SEPARATE WINDOWS
REM ════════════════════════════════════════════════════════════════
echo.
echo  ── Launching Services ──────────────────────────────────────────
echo  [INFO]  Backend  →  http://localhost:8000
echo  [INFO]  Frontend →  http://localhost:3000
echo  [INFO]  API Docs →  http://localhost:8000/docs
echo.

REM Start backend in new window
start "OmniMind - Backend" cmd /k "cd /d "%~dp0backend" && ..\backend\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait 3 seconds for backend to start before launching frontend
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "OmniMind - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo  [OK]    Both services launched in separate windows.
echo.
echo  ── Access Points ───────────────────────────────────────────────
echo   App      →  http://localhost:3000
echo   API      →  http://localhost:8000
echo   Docs     →  http://localhost:8000/docs
echo   Council  →  http://localhost:8000/api/council/health
echo   Debate   →  http://localhost:8000/api/debate/run
echo  ────────────────────────────────────────────────────────────────
echo.
echo  Close the backend and frontend windows to stop the servers.
echo.
pause
exit /b 0

REM ════════════════════════════════════════════════════════════════
:check_key
set "_val=!%~1!"
if "!_val!"=="" (
    echo  [WARN]  %~1 not set  ^|  %~2
) else (
    echo  [OK]    %~1 set      ^|  %~2
)
exit /b 0
