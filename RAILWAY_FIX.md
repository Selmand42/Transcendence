# 🔧 Railway Build Fix - Quick Guide

## ✅ What I Fixed

1. **Created `nixpacks.toml`** - Proper build configuration for Railway
2. **Updated `railway.json`** - Simplified configuration
3. **Fixed `package.json`** - Corrected the start script path
4. **Added `@fastify/cors`** - Already in package.json ✅

---

## 🚀 What You Need to Do Now

### Step 1: Make Sure You Have package-lock.json

```bash
cd srcs/backend
npm install
# This ensures package-lock.json is up to date
```

### Step 2: Commit and Push Everything

```bash
# Go to project root
cd /Users/selmandemir/Desktop/sonfalan

# Check what will be uploaded
git status

# Add all files
git add .

# Commit
git commit -m "Fix Railway build configuration

- Add nixpacks.toml for proper directory handling
- Update railway.json with simplified config
- Fix package.json start script path
- Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 3: Deploy on Railway

**Option A: If you already created a project on Railway:**
1. Railway will auto-deploy when you push
2. Check the logs to see if build succeeds

**Option B: If you haven't created a Railway project yet:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your `sonfalan` repository
5. Wait for build to complete

---

## 📋 Files You MUST Upload to GitHub

Essential files for Railway:

```
✅ nixpacks.toml                    ← NEW! (Tells Railway how to build)
✅ railway.json                     ← UPDATED
✅ srcs/backend/package.json        ← UPDATED (fixed start script)
✅ srcs/backend/package-lock.json   ← MUST HAVE
✅ srcs/backend/src/*.ts            ← All TypeScript source files
✅ srcs/backend/tsconfig.json       ← TypeScript config
```

Files you should NOT upload:
```
❌ node_modules/                    ← Too large, auto-installed
❌ .env                             ← Contains secrets
❌ srcs/backend/dist/               ← Generated during build
❌ srcs/backend/data/               ← Database (Railway creates new one)
```

---

## 🔍 What Railway Will Do

When you push to GitHub, Railway will:

```
1. ✅ Clone your repository
2. ✅ Read nixpacks.toml
3. ✅ Install Node.js 20
4. ✅ cd srcs/backend
5. ✅ npm ci (install from package-lock.json)
6. ✅ npm run build (compile TypeScript → dist/)
7. ✅ npm start (run: node dist/src/server.js)
8. ✅ Your backend is live! 🎉
```

---

## 🐛 If Build Still Fails

### Check Railway Logs

1. Go to your Railway project
2. Click on the service
3. Click "View Logs"
4. Look for error messages

### Common Issues & Solutions

**Error: "Cannot find module '@fastify/cors'"**
```bash
cd srcs/backend
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

**Error: "Cannot find package.json"**
- Make sure `nixpacks.toml` is in the root directory (not in srcs/)
- Check that `srcs/backend/package.json` exists

**Error: "Build command failed"**
```bash
# Test locally first
cd srcs/backend
npm run build
# If this works, Railway should work too
```

**Error: "ENOENT: no such file or directory, open 'dist/server.js'"**
- Already fixed! The start script now points to `dist/src/server.js`

---

## ⚙️ Environment Variables (After Build Succeeds)

Once the build succeeds, add these in Railway:

```bash
JWT_SECRET=<generate-64-char-random-string>
COOKIE_SECURE=true
NODE_ENV=production
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=https://your-app.railway.app/api/users/oauth/google/callback
FRONTEND_URL=https://your-site.netlify.app
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Quick Checklist

Before pushing:

- [ ] `nixpacks.toml` exists in root directory
- [ ] `srcs/backend/package-lock.json` exists
- [ ] No `node_modules/` staged (check with `git status`)
- [ ] No `.env` files staged
- [ ] `@fastify/cors` is in dependencies

After pushing:

- [ ] Railway build starts automatically
- [ ] Check logs for errors
- [ ] Once build succeeds, add environment variables
- [ ] Generate domain
- [ ] Test backend: `curl https://your-app.railway.app/health`

---

## 🎉 Success Indicators

Your build is successful when you see in Railway logs:

```
✅ Installing dependencies
✅ npm ci
✅ Building application
✅ npm run build
✅ Starting server
✅ Server listening at http://0.0.0.0:3000
```

Then your backend will be live at: `https://your-app.railway.app`

---

## 📞 Still Having Issues?

1. **Read Railway logs carefully** - They show exactly what failed
2. **Test build locally**:
   ```bash
   cd srcs/backend
   rm -rf dist node_modules
   npm install
   npm run build
   npm start
   ```
3. **Check `WHAT_TO_UPLOAD.md`** - Full troubleshooting guide
4. **Verify file structure**:
   ```bash
   ls nixpacks.toml
   ls srcs/backend/package.json
   ls srcs/backend/src/server.ts
   ```

---

## 📝 Summary

**The fix:**
- ✅ Added `nixpacks.toml` to handle the `srcs/backend` directory structure
- ✅ Fixed `package.json` start script path
- ✅ Simplified `railway.json`

**What you do:**
1. Run `npm install` in `srcs/backend`
2. Commit and push everything to GitHub
3. Railway will auto-deploy successfully! 🚀

Good luck! 🎮


