#!/bin/bash

echo "START OmniMind AI Frontend Setup"
echo "================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "NO Please run this from the OmniMind-AI root directory"
    echo "   Expected structure: OmniMind-AI/frontend/package.json"
    exit 1
fi

echo "OK Found frontend directory"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "NO Node.js is not installed"
    echo "   Please install Node.js from: https://nodejs.org/"
    echo "   Recommended version: 18.x or higher"
    echo ""
    echo "   Installation options:"
    echo "   • macOS: brew install node"
    echo "   • Ubuntu/Debian: sudo apt install nodejs npm"
    echo "   • CentOS/RHEL: sudo yum install nodejs npm"
    exit 1
fi

echo "OK Node.js is installed"
node --version

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "NO npm is not available"
    echo "   npm should come with Node.js installation"
    exit 1
fi

echo "OK npm is available"
npm --version
echo ""

# Navigate to frontend directory
cd frontend

echo " Installing frontend dependencies..."
echo "   This may take a few minutes..."
echo ""

# Clean install to avoid conflicts
if [ -d "node_modules" ]; then
    echo " Cleaning existing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo " Removing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies
npm install

if [ $? -ne 0 ]; then
    echo "NO Failed to install dependencies"
    echo "   Try running: npm install --legacy-peer-deps"
    echo "   Or: npm install --force"
    exit 1
fi

echo "OK Dependencies installed successfully"
echo ""

# Check if .env.local exists, create if not
if [ ! -f ".env.local" ]; then
    echo " Creating .env.local file..."
    cat > .env.local << EOF
# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo "OK Created .env.local with default API URL"
else
    echo "OK .env.local already exists"
fi

echo ""
echo "CONSENSUS Frontend setup completed successfully!"
echo ""
echo "INFO Next steps:"
echo "   1. Make sure backend is running on port 8000"
echo "   2. Run: npm run dev (to start development server)"
echo "   3. Open: http://localhost:3000"
echo ""
echo " Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run start   - Start production server"
echo "   npm run lint    - Run ESLint"
echo ""

read -p "Press Enter to continue..."