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
