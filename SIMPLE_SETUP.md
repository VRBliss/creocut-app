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
