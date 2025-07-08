@echo off

echo 🚀 Setting up Smart Clearance Pop-ups System...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v18 or higher) first.
    pause
    exit /b 1
)

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

:: Setup Frontend
echo 📦 Installing frontend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

:: Setup Backend
echo 🐍 Setting up backend...
cd backend

:: Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

:: Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

cd ..

echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Start the backend: cd backend ^&^& python main.py
echo 2. Start the frontend: npm run dev
echo.
echo Then visit http://localhost:5173 to use the app!
pause
