#!/bin/bash

echo "🎬 CreoCut Automatic Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from inside the creocut-app folder"
    echo ""
    echo "To fix:"
    echo "1. Open Terminal (Mac) or PowerShell (Windows)"
    echo "2. Type: cd "
    echo "3. Drag the creocut-app folder onto the terminal window"
    echo "4. Press Enter"
    echo "5. Type: chmod +x auto-setup.sh"
    echo "6. Type: ./auto-setup.sh"
    exit 1
fi

echo "📦 Step 1/4: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Make sure Node.js is installed."
    echo "Download from: https://nodejs.org"
    exit 1
fi

echo ""
echo "🗄️ Step 2/4: Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed."
    exit 1
fi

echo ""
echo "🏗️ Step 3/4: Creating database tables..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed. Check your DATABASE_URL in .env"
    exit 1
fi

echo ""
echo "🚀 Step 4/4: Starting the app..."
echo ""
echo "✅ Setup complete!"
echo ""
echo "The app will now start. Visit: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server when you're done."
echo ""

npm run dev
