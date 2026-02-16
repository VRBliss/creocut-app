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
