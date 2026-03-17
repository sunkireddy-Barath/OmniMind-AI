@echo off
echo 🔧 OmniMind AI - System Troubleshooting
echo ========================================

echo 📋 System Check Report
echo.

REM Check directory structure
echo 🗂️  Directory Structure:
if exist "backend\main.py" (
    echo ✅ Backend found
) else (
    echo ❌ Backend missing
)

if exist "frontend\package.json" (
    echo ✅ Frontend found
) else (
    echo ❌ Frontend missing
)

if exist "backend\requirements.docker.txt" (
    echo ✅ Backend requirements found
) else (
    echo ❌ Backend requirements missing
)

if exist "frontend\node_modules" (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies missing - run frontend-setup.bat
)

echo.

REM Check Node.js and Python
echo 🐍 Runtime Environments:
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python installed:
    python --version
) else (
    echo ❌ Python not found - install Python 3.11+
)

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js installed:
    node --version
) else (
    echo ❌ Node.js not found - install Node.js 18+
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm available:
    npm --version
) else (
    echo ❌ npm not found
)

echo.

REM Check API Keys
echo 🔑 API Configuration:
if "%OPENAI_API_KEY%"=="" (
    echo ❌ OPENAI_API_KEY not set
) else (
    echo ✅ OPENAI_API_KEY configured (length: %OPENAI_API_KEY:~0,10%...)
)

if "%GOOGLE_API_KEY%"=="" (
    echo ⚠️  GOOGLE_API_KEY not set (optional)
) else (
    echo ✅ GOOGLE_API_KEY configured
)

if "%GROQ_API_KEY%"=="" (
    echo ⚠️  GROQ_API_KEY not set (optional)
) else (
    echo ✅ GROQ_API_KEY configured
)

if "%TAVILY_API_KEY%"=="" (
    echo ⚠️  TAVILY_API_KEY not set (optional)
) else (
    echo ✅ TAVILY_API_KEY configured
)

echo.

REM Check services
echo 🌐 Service Connectivity:
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend running on port 8000
) else (
    echo ❌ Backend not responding on port 8000
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend running on port 3000
) else (
    echo ❌ Frontend not responding on port 3000
)

echo.

REM Check backend dependencies
echo 📦 Backend Dependencies:
if exist "backend\venv" (
    echo ✅ Virtual environment found
) else (
    echo ⚠️  Virtual environment not found
)

echo.

REM Common solutions
echo 🛠️  Common Solutions:
echo.
echo ❌ If backend won't start:
echo    Simply run: backend.bat
echo    (handles venv creation, deps install, and server start)
echo.
echo ❌ If frontend won't start:
echo    1. Run frontend-setup.bat
echo    2. cd frontend
echo    3. npm run dev
echo.
echo ❌ If API keys missing:
echo    1. Get OpenAI API key from: https://platform.openai.com/
echo    2. Get Tavily API key from: https://tavily.com/
echo    3. Set environment variables:
echo       set OPENAI_API_KEY=your_key_here
echo       set TAVILY_API_KEY=your_key_here
echo.
echo ❌ If ports are busy:
echo    1. Check what's using ports 3000/8000:
echo       netstat -ano | findstr :3000
echo       netstat -ano | findstr :8000
echo    2. Kill processes or use different ports
echo.

echo 📞 Need Help?
echo    1. Check logs in terminal windows
echo    2. Verify all API keys are set correctly
echo    3. Ensure Python 3.11+ and Node.js 18+ installed
echo    4. Try running components separately first
echo.

pause