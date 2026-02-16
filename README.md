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
