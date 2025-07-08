#!/bin/bash

# Smart Clearance Pop-ups System - Setup Script

echo "🚀 Setting up Smart Clearance Pop-ups System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Set Python command
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo "✅ Prerequisites check passed"

# Setup Frontend
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Setup Backend
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
$PYTHON_CMD -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Backend setup failed"
    exit 1
fi

echo "✅ Backend dependencies installed"

cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && python main.py"
echo "2. Start the frontend: npm run dev"
echo ""
echo "Then visit http://localhost:5173 to use the app!"
