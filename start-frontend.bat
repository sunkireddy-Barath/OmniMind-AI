@echo off
cd /d "%~dp0"
title OmniMind AI - Frontend
color 0B

echo.
echo  ============================================
echo   OmniMind AI - Start Frontend
echo  ============================================
echo.

if not exist "frontend\package.json" (
    echo  [ERROR] frontend\package.json not found.
    echo  [INFO]  Run frontend-setup.bat first.
    pause & exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org/
    pause & exit /b 1
)

cd frontend

if not exist "node_modules" (
    echo  [INFO]  node_modules not found — running npm install ...
    npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] npm install failed.
        pause & exit /b 1
    )
)

if not exist ".env.local" (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo  [OK]    Created .env.local
)

echo  [OK]    Frontend ready
echo  [INFO]  App  →  http://localhost:3000
echo  [INFO]  API  →  http://localhost:8000  ^(backend must be running^)
echo.
echo  Starting dev server in a new window...
echo  ────────────────────────────────────────────────────────────────

start "OmniMind AI - Frontend Dev" cmd /k "npm run dev"
