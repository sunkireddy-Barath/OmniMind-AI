@echo off
cd /d "%~dp0"
echo START OmniMind AI Frontend Setup
echo ================================

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo NO Please run this from the OmniMind-AI root directory
    echo    Expected structure: OmniMind-AI\frontend\package.json
    pause
    exit /b 1
)

echo OK Found frontend directory
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo NO Node.js is not installed or not in PATH
    echo    Please install Node.js from: https://nodejs.org/
    echo    Recommended version: 18.x or higher
    pause
    exit /b 1
)

echo OK Node.js is installed
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [WARN]  npm not found in PATH — trying npx fallback
)

REM Navigate to frontend directory
cd frontend

echo  Installing frontend dependencies...
echo    This may take a few minutes...
echo.

REM Clean install to avoid conflicts
if exist "node_modules" (
    echo  Cleaning existing node_modules...
    rmdir /s /q node_modules
)

if exist "package-lock.json" (
    echo  Removing package-lock.json...
    del package-lock.json
)

REM Install dependencies
npm install

if %errorlevel% neq 0 (
    echo NO Failed to install dependencies
    echo    Try running: npm install --legacy-peer-deps
    echo    Or: npm install --force
    pause
    exit /b 1
)

echo OK Dependencies installed successfully
echo.

REM Check if .env.local exists, create if not
if not exist ".env.local" (
    echo  Creating .env.local file...
    echo # Frontend environment variables > .env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 >> .env.local
    echo OK Created .env.local with default API URL
) else (
    echo OK .env.local already exists
)

echo.
echo CONSENSUS Frontend setup completed successfully!
echo.
echo INFO Next steps:
echo    1. Make sure backend is running on port 8000
echo    2. Run: npm run dev (to start development server)
echo    3. Open: http://localhost:3000
echo.
echo  Available commands:
echo    npm run dev     - Start development server
echo    npm run build   - Build for production
echo    npm run start   - Start production server
echo    npm run lint    - Run ESLint
echo.

pause