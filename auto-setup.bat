@echo off
echo =============================
echo CreoCut Automatic Setup
echo =============================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: Please run this script from inside the creocut-app folder
    echo.
    echo To fix:
    echo 1. Open PowerShell or Command Prompt
    echo 2. Type: cd 
    echo 3. Drag the creocut-app folder into the window
    echo 4. Press Enter
    echo 5. Type: auto-setup.bat
    pause
    exit /b 1
)

echo Step 1/4: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed. Make sure Node.js is installed.
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Step 2/4: Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed.
    pause
    exit /b 1
)

echo.
echo Step 3/4: Creating database tables...
call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ERROR: Database migration failed. Check your DATABASE_URL in .env
    pause
    exit /b 1
)

echo.
echo Step 4/4: Starting the app...
echo.
echo Setup complete!
echo.
echo The app will now start. Visit: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

call npm run dev
