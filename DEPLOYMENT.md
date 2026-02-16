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
