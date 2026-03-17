@echo off
setlocal EnableDelayedExpansion
title OmniMind AI - Backend Setup
color 0B

REM ── Always cd to this bat's directory ───────────────────────────────
cd /d "%~dp0"

echo.
echo  ============================================
echo   OmniMind AI - Backend Setup
echo   Multi-Agent Debate + LLM Council
echo  ============================================
echo.

if not exist "backend\main.py" (
    echo  [ERROR] backend\main.py not found in: %~dp0
    pause & exit /b 1
)

REM ── .env setup ──────────────────────────────────────────────────────
if exist ".env" (
    echo  [OK]    .env found
) else (
    if exist ".env.example" (
        echo  [INFO]  No .env found. Copying from .env.example ...
        copy ".env.example" ".env" >nul
        echo  [OK]    .env created — opening for editing ...
        notepad ".env"
        echo  [INFO]  Save your API keys, then run start-backend.bat
        pause & exit /b 0
    ) else (
        echo  [WARN]  No .env or .env.example found. Continuing anyway.
    )
)

REM ── Python check ────────────────────────────────────────────────────
echo.
echo  ── Runtime Check ───────────────────────────────────────────────
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON=python3
) else (
    python --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON=python
    ) else (
        echo  [ERROR] Python not found. Install Python 3.11+ from https://python.org
        pause & exit /b 1
    )
)
for /f "tokens=*" %%v in ('!PYTHON! --version 2^>^&1') do echo  [OK]    %%v

REM ── Virtual environment ─────────────────────────────────────────────
echo.
echo  ── Virtual Environment ─────────────────────────────────────────
if exist "backend\venv\Scripts\python.exe" (
    echo  [OK]    venv already exists — skipping creation
) else (
    echo  [INFO]  Creating venv ...
    !PYTHON! -m venv backend\venv
    if %errorlevel% neq 0 (
        echo  [ERROR] Failed to create venv.
        pause & exit /b 1
    )
    echo  [OK]    venv created
)

set VENV_PY=backend\venv\Scripts\python.exe

REM ── Install dependencies ─────────────────────────────────────────────
echo.
echo  ── Installing Dependencies ─────────────────────────────────────
echo  [INFO]  Upgrading pip ...
%VENV_PY% -m pip install --quiet --upgrade pip 2>nul

echo  [INFO]  Installing from requirements.txt ...
echo  [INFO]  This may take 2-5 minutes on first run ...
%VENV_PY% -m pip install --quiet -r requirements.txt
if %errorlevel% neq 0 (
    echo  [WARN]  Some packages failed — retrying without version pins ...
    %VENV_PY% -m pip install --quiet ^
        fastapi "uvicorn[standard]" "pydantic>=2.8.2" pydantic-settings ^
        python-dotenv python-multipart aiofiles httpx ^
        langchain langchain-openai langchain-community ^
        langchain-google-genai langchain-groq langchain-tavily ^
        openai groq google-generativeai tavily-python ^
        "sqlalchemy[asyncio]" aiosqlite asyncpg ^
        redis aioredis sentence-transformers numpy tiktoken
)

echo.
echo  ── Verifying Key Packages ──────────────────────────────────────
for %%P in (fastapi uvicorn langchain openai langchain_google_genai langchain_groq langchain_tavily sentence_transformers aiosqlite asyncpg) do (
    %VENV_PY% -c "import %%P" >nul 2>&1
    if !errorlevel! equ 0 (
        echo  [OK]    %%P
    ) else (
        echo  [WARN]  %%P — not importable, may need manual install
    )
)

echo.
echo  ============================================
echo   Setup complete. Run start-backend.bat
echo   to launch the server.
echo  ============================================
echo.
pause
exit /b 0
