# Gemini API Configuration
GEMINI_API_KEY=AIzaSyARto0tS5j_8i5B8IgPpao-be6JPCg_Kz4

# YouTube Data API Configuration
YOUTUBE_API_KEY=AIzaSyCP60fEEQ8wdcugYi5c8XKQ1TPfqBQ7UAQ

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/creocut?schema=public"

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=524288000
UPLOAD_DIR=./uploads

{
  "extends": "next/core-web-vitals"
}

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# uploads
/uploads/*
!/uploads/.gitkeep

# prisma
/prisma/migrations/*
!/prisma/migrations/.gitkeep

# IDE
.idea
.vscode
*.swp
*.swo
*~

# 🎉 Your API Keys Are Configured!

Your `.env` file has been created with your API keys:
- ✅ Gemini API Key: AIzaSyARto0tS5j_8i5B8IgPpao-be6JPCg_Kz4
- ✅ YouTube API Key: AIzaSyCP60fEEQ8wdcugYi5c8XKQ1TPfqBQ7UAQ

## Next Steps: Database Setup

You need to set up a database. Choose one option:

### Option 1: Use Supabase (Easiest - 2 minutes)

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - Name: creocut
   - Password: (create a strong password)
   - Region: Choose closest to you
4. Wait for project to be created
5. Go to **Settings** → **Database**
6. Copy the **Connection String** (URI format)
7. Update `.env` file - replace this line:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/creocut?schema=public"
   ```
   With your Supabase connection string (looks like):
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### Option 2: Use Local PostgreSQL (If already installed)

If you have PostgreSQL on your computer:

1. Create a database:
   ```bash
   psql -U postgres
   CREATE DATABASE creocut;
   \q
   ```

2. Update `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/creocut?schema=public"
   ```

### Option 3: Use Neon (Alternative free option)

1. Go to https://neon.tech and sign up
2. Create new project
3. Copy the connection string
4. Paste into `.env` as `DATABASE_URL`

## Run the App

Once you've set up the database:

```bash
cd creocut-app

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev --name init

# Start the app
npm run dev
```

Visit http://localhost:3000 🚀

## Troubleshooting

**If you see database errors:**
- Make sure you replaced the `DATABASE_URL` in `.env`
- Check that your database is running
- Verify your password is correct (no special characters can cause issues)

**Need help?**
- Check the full README.md for detailed instructions
- See QUICKSTART.md for common issues

## Security Reminder

✅ Your `.env` file is in `.gitignore` - it won't be committed to Git
✅ You can regenerate these API keys anytime from:
   - Gemini: https://makersuite.google.com/app/apikey
   - YouTube: https://console.cloud.google.com/apis/credentials

You're almost ready to start analyzing videos! Just set up the database and you're good to go. 🎬

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

# CreoCut Deployment Guide

This guide covers deploying CreoCut to various platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Railway Deployment](#railway-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)

## Vercel Deployment

Vercel is the recommended platform for deploying Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `GEMINI_API_KEY`
   - `YOUTUBE_API_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Database Options for Vercel:
- **Vercel Postgres** (recommended)
- **Supabase**
- **Neon**
- **PlanetScale**

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://creocut:password@db:5432/creocut
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=creocut
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=creocut
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Run with Docker

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

## Railway Deployment

Railway provides easy deployment with integrated PostgreSQL.

### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-create `DATABASE_URL`

4. **Add Environment Variables**
   - Go to Variables tab
   - Add:
     - `GEMINI_API_KEY`
     - `YOUTUBE_API_KEY`
     - `NEXT_PUBLIC_APP_URL` (your Railway URL)

5. **Deploy**
   - Railway auto-deploys on push to main
   - Run migrations via Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```

## Environment Variables

### Required Variables

```env
# Gemini AI
GEMINI_API_KEY=your_key_here

# YouTube Data API
YOUTUBE_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables

```env
# Upload Configuration
MAX_FILE_SIZE=524288000  # 500MB
UPLOAD_DIR=./uploads

# Node Environment
NODE_ENV=production
```

## Database Setup

### Using Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Use as `DATABASE_URL`

Example URL:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### Using Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string
4. Use as `DATABASE_URL`

### Using PlanetScale

1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Modify Prisma schema for MySQL
5. Use as `DATABASE_URL`

### Running Migrations

After setting up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run successfully
- [ ] Uploads directory writable
- [ ] API keys tested and working
- [ ] SSL/HTTPS enabled
- [ ] Domain configured (if using custom domain)
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)

## Monitoring

### Recommended Tools

- **Vercel Analytics** - Built-in for Vercel deployments
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Application monitoring

## Troubleshooting

### Build Failures

```bash
# Clear cache
npm run clean
npm install

# Regenerate Prisma
npx prisma generate

# Rebuild
npm run build
```

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check database server is running
- Ensure IP whitelist includes deployment platform
- Verify SSL settings if required

### API Rate Limits

- Monitor Gemini API usage
- Monitor YouTube API quota
- Implement caching if needed
- Consider upgrading API plans

## Scaling Considerations

### For High Traffic:

1. **Database Connection Pooling**
   - Use Prisma connection pooling
   - Consider PgBouncer for PostgreSQL

2. **Caching**
   - Cache YouTube API responses
   - Cache analysis results
   - Use Redis for session storage

3. **File Storage**
   - Move uploads to S3/Cloudflare R2
   - Implement CDN for static assets

4. **Background Jobs**
   - Use queue system (Bull, BullMQ)
   - Process videos asynchronously
   - Implement webhooks for status updates

## Security

### Best Practices:

- Never commit `.env` files
- Rotate API keys regularly
- Use environment variables for secrets
- Enable CORS properly
- Implement rate limiting
- Sanitize user inputs
- Use HTTPS only
- Set secure headers

## Support

For deployment issues:
- Check platform-specific documentation
- Review deployment logs
- Consult troubleshooting section
- Open GitHub issue if needed

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
}

module.exports = nextConfig

{
  "name": "creocut-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@prisma/client": "^5.22.0",
    "axios": "^1.7.9",
    "googleapis": "^144.0.0",
    "lucide-react": "^0.469.0",
    "next": "14.2.23",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.15.0",
    "formidable": "^3.5.2",
    "ytdl-core": "^4.11.5"
  },
  "devDependencies": {
    "@types/node": "^20.17.10",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/formidable": "^3.4.5",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.23",
    "postcss": "^8.4.49",
    "prisma": "^5.22.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

# CreoCut Quick Start Guide

Get CreoCut running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Gemini API key
- YouTube Data API key

## Quick Setup

### 1. Install (2 minutes)

```bash
# Clone or download the project
cd creocut-app

# Run setup script (Unix/Mac)
chmod +x setup.sh
./setup.sh

# Or install manually
npm install
cp .env.example .env
mkdir uploads
```

### 2. Configure (2 minutes)

Edit `.env` file:

```env
GEMINI_API_KEY=your_gemini_key_here
YOUTUBE_API_KEY=your_youtube_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/creocut
```

### 3. Database Setup (1 minute)

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run (30 seconds)

```bash
npm run dev
```

Visit: http://localhost:3000

## Getting API Keys

### Gemini API Key (Free)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

### YouTube API Key (Free)
1. Visit: https://console.cloud.google.com/
2. Create project
3. Enable YouTube Data API v3
4. Create credentials → API Key
5. Copy and paste into `.env`

## First Analysis

1. Click **"Get Started"**
2. Choose **YouTube URL** or **Upload Video**
3. Select **Target Audience** (e.g., Gen Z)
4. Click **"Analyze Video"**
5. Wait for results (1-2 minutes)

## Features You Can Try

### YouTube Analysis
- Paste any YouTube URL
- Get benchmarking vs similar videos
- See performance metrics

### Upload Analysis
- Upload MP4, MOV, or AVI
- Max 500MB file size
- Get AI feedback

### Audience Targeting
- **Gen Z**: Fast-paced, trendy content
- **Millennials**: Story-driven, authentic
- **Gen X**: Straightforward, informative
- **Baby Boomers**: Traditional, detailed

## Understanding Results

Your analysis includes:

**Scores (0-100)**
- Overall Score
- Edit Quality
- Pacing
- Retention Potential

**Insights**
- ✅ Strengths (what's working)
- ❌ Weaknesses (what to improve)
- 💡 Recommendations (specific actions)
- ⚠️ Risk Zones (drop-off moments)

**Detailed Analysis**
- Edit Analysis (cuts, transitions, effects)
- Pacing Analysis (rhythm, engagement)
- Audio Analysis (music, sound design)

## Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
brew services start postgresql  # Mac
sudo service postgresql start   # Linux

# Verify DATABASE_URL in .env
```

### "API key invalid"
- Check keys are copied correctly
- Verify no extra spaces
- Ensure keys are active

### "Upload failed"
- Check file is under 500MB
- Ensure uploads/ directory exists
- Try supported formats: MP4, MOV, AVI

### "Analysis taking too long"
- First analysis may take 2-3 minutes
- Check server logs: `npm run dev`
- Verify Gemini API is responding

## Next Steps

1. **Customize Analysis**
   - Edit prompts in `lib/gemini.ts`
   - Adjust scoring weights

2. **Add Features**
   - Export reports as PDF
   - Email notifications
   - Team collaboration

3. **Deploy to Production**
   - See `DEPLOYMENT.md`
   - Recommended: Vercel + Supabase

## Need Help?

- 📖 Full documentation: `README.md`
- 🚀 Deployment guide: `DEPLOYMENT.md`
- 🐛 Issues: Open on GitHub
- 💬 Questions: Check FAQ below

## FAQ

**Q: Is this free to use?**
A: Yes! Gemini and YouTube APIs have free tiers.

**Q: Can I analyze private YouTube videos?**
A: No, only public videos are supported.

**Q: What file formats are supported?**
A: MP4, MOV, AVI, and most common video formats.

**Q: How accurate is the AI analysis?**
A: Analysis is based on industry best practices and audience research, but should be used as guidance, not gospel.

**Q: Can I use this for client work?**
A: Yes, the MIT license allows commercial use.

**Q: How do I add more audience types?**
A: Edit `lib/gemini.ts` to add new audience profiles.

## Tips for Best Results

✅ **Do:**
- Use descriptive video titles
- Target one specific audience
- Review all recommendations
- Test changes and re-analyze

❌ **Avoid:**
- Analyzing very short videos (<30s)
- Using copyrighted content
- Exceeding API rate limits
- Ignoring risk zones

## Performance Tips

- **Cache YouTube data** to reduce API calls
- **Process uploads asynchronously** for better UX
- **Use environment-specific configs** for dev/prod
- **Monitor API usage** to avoid hitting limits

## Community

- ⭐ Star the project on GitHub
- 🐛 Report bugs via Issues
- 💡 Suggest features
- 🤝 Contribute code

---

**Happy analyzing!** 🎬✨

# CreoCut - AI Video Analysis Platform

CreoCut is a comprehensive AI-powered video analysis platform that helps content creators optimize their videos for maximum retention. The app leverages Google's Gemini AI to provide detailed feedback on edit quality, pacing, and effectiveness based on target audience demographics.

## Features

### Core Functionality
- ✅ **YouTube URL Analysis** - Analyze any public YouTube video
- ✅ **Video File Upload** - Upload your own videos (max 500MB)
- ✅ **Target Audience Selection** - Customize analysis for Gen Z, Millennials, Gen X, or Baby Boomers
- ✅ **AI-Powered Analysis** - Comprehensive video review using Gemini 1.5 Flash
- ✅ **YouTube Benchmarking** - Compare performance against similar videos
- ✅ **Detailed Reporting** - Visual dashboards with scores, recommendations, and risk zones

### Analysis Components
1. **Overall Scoring** - Aggregate performance metrics
2. **Edit Quality Analysis** - Transitions, cuts, visual effects
3. **Pacing Analysis** - Rhythm, engagement, momentum
4. **Audio Analysis** - Music choice, sound design, audience alignment
5. **Risk Zone Detection** - Identify moments where viewers might drop off
6. **Actionable Recommendations** - Specific steps to improve retention
7. **Benchmark Comparison** - Performance vs similar videos on YouTube

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Google Gemini AI** - Video analysis
- **YouTube Data API v3** - Video metadata and benchmarking

## Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.x or higher
- **PostgreSQL** database
- **Google Gemini API key** ([Get one here](https://makersuite.google.com/app/apikey))
- **YouTube Data API key** ([Get one here](https://console.cloud.google.com/apis/credentials))

## Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/creocut-app.git
cd creocut-app
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your API keys:

\`\`\`env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# YouTube Data API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/creocut?schema=public"

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=524288000
UPLOAD_DIR=./uploads
\`\`\`

### 4. Set Up the Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
\`\`\`

### 5. Create Uploads Directory

\`\`\`bash
mkdir uploads
\`\`\`

### 6. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## API Keys Setup

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### Getting a YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Go to Credentials → Create Credentials → API Key
5. Copy the key and add it to your `.env` file

## Project Structure

\`\`\`
creocut-app/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # Video analysis endpoint
│   │   └── results/
│   │       └── [id]/
│   │           └── route.ts      # Results fetching endpoint
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx          # Results display page
│   ├── wizard/
│   │   └── page.tsx              # Video upload wizard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── lib/
│   ├── gemini.ts                 # Gemini AI integration
│   ├── youtube.ts                # YouTube API integration
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
├── uploads/                      # Video upload directory
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
\`\`\`

## Usage

### Analyzing a Video

1. **Navigate to the wizard**: Click "Get Started" on the homepage
2. **Choose video source**: Select YouTube URL or upload a file
3. **Select target audience**: Choose Gen Z, Millennials, Gen X, or Baby Boomers
4. **Review and submit**: Confirm your selections and start analysis
5. **View results**: Wait for processing, then explore your comprehensive analysis

### Understanding Results

The results page provides:

- **Overall Score** - Aggregate performance rating (0-100)
- **Score Breakdown** - Individual scores for edit quality, pacing, and retention
- **Performance Radar** - Visual representation of all metrics
- **Strengths & Weaknesses** - What's working and what needs improvement
- **Retention Timeline** - Estimated viewer retention over time
- **Risk Zones** - Specific timestamps where viewers might drop off
- **Detailed Analysis** - In-depth feedback on edits, pacing, and audio
- **Recommendations** - Actionable steps to improve your video
- **Benchmark Data** - How you compare to similar videos (YouTube only)

## Database Schema

### Video Table
Stores video metadata and upload information.

### Analysis Table
Stores comprehensive AI-generated analysis results.

### BenchmarkVideo Table
Caches YouTube data for similar videos to reduce API calls.

## API Endpoints

### POST `/api/analyze`
Initiates video analysis.

**Request Body (FormData):**
- `targetAudience`: string (gen_z | millennials | gen_x | baby_boomers)
- `sourceType`: string (youtube | upload)
- `youtubeUrl`: string (if sourceType is youtube)
- `file`: File (if sourceType is upload)

**Response:**
\`\`\`json
{
  "videoId": "video-id",
  "message": "Analysis started"
}
\`\`\`

### GET `/api/results/[id]`
Retrieves analysis results for a video.

**Response:**
\`\`\`json
{
  "video": { ... },
  "analysis": { ... }
}
\`\`\`

## Customization

### Adjusting AI Prompts

Edit `/lib/gemini.ts` to customize the AI analysis prompts for different audience types or analysis depth.

### Adding New Audience Types

1. Update the Prisma schema in `prisma/schema.prisma`
2. Add the new audience to `audienceProfiles` in `/lib/gemini.ts`
3. Add the option to the wizard in `/app/wizard/page.tsx`
4. Run `npx prisma migrate dev` to update the database

### Changing Upload Limits

Update `MAX_FILE_SIZE` in `.env` and adjust the Next.js config in `next.config.js`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `GEMINI_API_KEY`
- `YOUTUBE_API_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

### Database

For production, use a managed PostgreSQL service like:
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` format
- Run `npx prisma migrate dev` to sync schema

### API Key Errors
- Verify your Gemini and YouTube API keys are valid
- Check for rate limits on your APIs
- Ensure keys are properly set in `.env`

### Upload Failures
- Check file size (must be under 500MB)
- Ensure `uploads/` directory exists and is writable
- Verify Next.js config allows large uploads

### Analysis Not Completing
- Check server logs for errors
- Verify Gemini API is responding
- For YouTube videos, ensure the URL is valid and public

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

## Roadmap

- [ ] Video playback integration
- [ ] Real-time analysis progress updates
- [ ] Export reports as PDF
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Integration with more video platforms
- [ ] Mobile app

## Acknowledgments

- Google Gemini AI for powerful video analysis
- YouTube Data API for benchmarking data
- Next.js team for the excellent framework
- All contributors and users of CreoCut

# 🎉 EVERYTHING IS CONFIGURED!

Your CreoCut app is now fully configured with:
- ✅ Gemini API Key
- ✅ YouTube API Key  
- ✅ Supabase PostgreSQL Database

## 🚀 Run These Commands Now

Open your terminal and run:

```bash
cd creocut-app

# Install all dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

## 🌐 Access Your App

After running `npm run dev`, visit:
**http://localhost:3000**

## 🎬 How to Use

1. Click **"Get Started"**
2. Choose **YouTube URL** or **Upload Video**
3. Select your **Target Audience**
4. Click **"Analyze Video"**
5. Wait 1-2 minutes for AI analysis
6. View your comprehensive results!

## 📊 What You'll Get

- Overall retention score (0-100)
- Edit quality analysis
- Pacing feedback
- Risk zones with timestamps
- Specific recommendations
- Comparison with similar YouTube videos (if analyzing YouTube URL)

## ⚠️ Common First-Time Issues

**If `npm install` fails:**
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

**If database migration fails:**
- Check your internet connection (needs to reach Supabase)
- Verify the DATABASE_URL is correct in `.env`
- Make sure Supabase project is active

**If the app starts but API errors occur:**
- Restart the server (Ctrl+C, then `npm run dev` again)
- Check that `.env` file is in the `creocut-app` folder

## 🧪 Test With These

**YouTube URLs to try:**
- https://www.youtube.com/watch?v=dQw4w9WgXcQ (test video)
- Any public YouTube video you want to analyze

**Upload Test:**
- Use any MP4, MOV, or AVI file under 500MB

## 📝 Technical Details

**Your Database:** 
- Host: db.qvchrkbjjefszzkbkzts.supabase.co
- Database: postgres
- Connection is secure and encrypted

**API Keys Active:**
- Gemini: ✅ Configured
- YouTube: ✅ Configured

## 🔄 Next Time You Want to Run

Just do:
```bash
cd creocut-app
npm run dev
```

No need to reinstall or migrate again!

## 🎓 Learning the Code

Want to customize? Check these files:
- `lib/gemini.ts` - AI analysis prompts
- `app/wizard/page.tsx` - Upload wizard UI
- `app/results/[id]/page.tsx` - Results dashboard
- `prisma/schema.prisma` - Database structure

## 🚀 Ready to Deploy?

Once you've tested locally, check:
- `DEPLOYMENT.md` - How to deploy to Vercel
- `README.md` - Full documentation

---

**You're all set!** Just run the commands above and start analyzing videos. 🎬✨

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

# 🎬 SUPER SIMPLE SETUP GUIDE

I've created **automatic setup scripts** that do everything for you!

---

## 🍎 FOR MAC USERS

### Step 1: Open Terminal (15 seconds)
1. Click the **magnifying glass** icon in top-right corner (Spotlight)
2. Type: **terminal**
3. Press **Enter**
4. A window with white or black text appears

### Step 2: Navigate to Folder (30 seconds)
1. In Terminal, type: **cd** (with a space after)
2. Open **Finder** and find your **creocut-app** folder
3. **Drag the creocut-app folder** from Finder into the Terminal window
4. Press **Enter**

### Step 3: Run Setup Script (5 seconds)
Copy and paste these two commands, one at a time:

```bash
chmod +x auto-setup.sh
```
Press Enter, then:

```bash
./auto-setup.sh
```
Press Enter

### Step 4: Done! (2-3 minutes automatic)
- Watch it install everything automatically
- When you see "Ready on http://localhost:3000"
- Open your browser to: **http://localhost:3000**

---

## 🪟 FOR WINDOWS USERS

### Step 1: Open PowerShell (15 seconds)
1. Click **Start button** (Windows logo)
2. Type: **powershell**
3. Click **Windows PowerShell** (blue icon)
4. A blue window appears

### Step 2: Navigate to Folder (30 seconds)
1. In PowerShell, type: **cd** (with a space after)
2. Open **File Explorer** and find your **creocut-app** folder
3. **Drag the creocut-app folder** into the PowerShell window
4. Press **Enter**

### Step 3: Run Setup Script (5 seconds)
Just type this and press Enter:

```powershell
.\auto-setup.bat
```

### Step 4: Done! (2-3 minutes automatic)
- Watch it install everything automatically
- When you see "Ready on http://localhost:3000"
- Open your browser to: **http://localhost:3000**

---

## 🎉 What Happens Next?

The script will automatically:
1. ✅ Install all packages (2 minutes)
2. ✅ Set up the database (30 seconds)
3. ✅ Create all tables (30 seconds)
4. ✅ Start the app (instant)

You just watch it work!

---

## ⚠️ If You See "Node.js Not Found"

You need to install Node.js first (one-time, 5 minutes):

1. Go to: **https://nodejs.org**
2. Click the big green **"Download"** button
3. Run the installer (click Next, Next, Install)
4. **Close and reopen** Terminal/PowerShell
5. Try the setup script again

---

## 🆘 Still Stuck?

### Can't find Terminal/PowerShell?
- **Mac:** Press Command+Spacebar, type "terminal"
- **Windows:** Press Windows key, type "powershell"

### Can't find creocut-app folder?
- Check your **Downloads** folder
- Or wherever you saved the files I gave you

### Drag and drop not working?
Instead of dragging, you can type the full path:
- **Mac example:** `cd /Users/yourname/Downloads/creocut-app`
- **Windows example:** `cd C:\Users\yourname\Downloads\creocut-app`

### Script says "permission denied"? (Mac only)
Make sure you ran this first:
```bash
chmod +x auto-setup.sh
```

---

## 📹 What You'll See

When it's working, you'll see text scrolling like:
```
Installing dependencies...
✓ react installed
✓ next installed
✓ prisma installed
...
Ready on http://localhost:3000
```

Then just open your browser to that address!

---

## 🎮 Using the App

Once it's running:
1. Go to **http://localhost:3000**
2. Click **"Get Started"**
3. Paste a YouTube URL (try any video!)
4. Choose your audience
5. Click **"Analyze"**
6. Wait 1-2 minutes
7. See real AI analysis! 🎉

---

## 🛑 To Stop the App Later

Press **Ctrl+C** in the terminal window

To start it again next time:
```bash
cd /path/to/creocut-app
npm run dev
```

---

## 💡 Pro Tip

Bookmark this in your terminal:
```bash
cd ~/Downloads/creocut-app && npm run dev
```
This goes to the folder AND starts the app in one command!

---

**You got this!** Just follow the steps for your computer (Mac or Windows) and the script does the rest. 🚀

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        secondary: {
          DEFAULT: '#EC4899',
          dark: '#DB2777',
        },
      },
    },
  },
  plugins: [],
}

{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
