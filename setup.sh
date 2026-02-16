#!/bin/bash

echo "🎬 CreoCut Setup Script"
echo "======================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please ensure PostgreSQL is installed and running."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys!"
    echo ""
    echo "You need:"
    echo "  1. Gemini API Key: https://makersuite.google.com/app/apikey"
    echo "  2. YouTube API Key: https://console.cloud.google.com/apis/credentials"
    echo "  3. PostgreSQL Database URL"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
echo ""
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Prisma setup
echo ""
echo "🗄️  Setting up database..."
read -p "Do you want to run Prisma migrations now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma generate
    npx prisma migrate dev --name init
    echo "✅ Database setup complete!"
else
    echo "⏭️  Skipping database setup. Run 'npx prisma migrate dev' when ready."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env and add your API keys"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:3000"
echo ""
echo "Happy analyzing! 🚀"
