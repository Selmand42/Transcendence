# 🚀 Deployment Guide: Netlify + Railway

This guide will help you deploy your Pong game with:
- **Frontend** on Netlify (static hosting)
- **Backend** on Railway (Node.js server with WebSocket support)

## 📋 Prerequisites

1. GitHub account
2. [Railway](https://railway.app) account (free tier available)
3. [Netlify](https://netlify.com) account (free tier available)
4. Google Cloud Console project (for OAuth)

---

## 🎯 Part 1: Deploy Backend to Railway

### Step 1: Push Your Code to GitHub

```bash
cd /Users/selmandemir/Desktop/sonfalan
git init
git add .
git commit -m "Initial commit for deployment"
gh repo create sonfalan --public --source=. --remote=origin --push
# Or use GitHub web interface to create repository
```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your `sonfalan` repository
5. Railway will auto-detect the configuration from `railway.json`

### Step 3: Configure Environment Variables on Railway

In Railway project settings, add these environment variables:

```bash
JWT_SECRET=your-super-secret-random-string-here-min-32-chars
COOKIE_SECURE=true
NODE_ENV=production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/users/oauth/google/callback
FRONTEND_URL=https://your-site.netlify.app
PORT=3000
HOST=0.0.0.0
```

**To generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Install @fastify/cors Package

Before deploying, install the CORS package:

```bash
cd srcs/backend
npm install @fastify/cors
git add package.json package-lock.json
git commit -m "Add @fastify/cors for production"
git push
```

### Step 5: Get Your Railway Backend URL

After deployment completes:
1. Go to your Railway project
2. Click on the service
3. Go to "Settings" → "Networking"
4. Click "Generate Domain"
5. Copy the URL (e.g., `https://your-app.railway.app`)

**📝 Save this URL - you'll need it for Netlify!**

---

## 🌐 Part 2: Deploy Frontend to Netlify

### Step 1: Create Production Environment File

You cannot commit .env files directly. Instead, you'll configure environment variables in Netlify dashboard.

### Step 2: Deploy to Netlify via GitHub

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize
4. Select your `sonfalan` repository
5. Configure build settings:
   - **Base directory**: `srcs/frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `srcs/frontend/dist`
   - **Node version**: 20

6. Click "Show advanced" → "New variable" and add:
   - `VITE_API_URL` = `https://your-app.railway.app` (your Railway URL)
   - `VITE_WS_URL` = `wss://your-app.railway.app` (same URL with wss://)

7. Click "Deploy site"

### Step 3: Get Your Netlify URL

After deployment:
1. Copy your site URL (e.g., `https://your-site.netlify.app`)
2. Optionally, configure a custom domain in "Domain settings"

---

## 🔐 Part 3: Update OAuth and Backend Configuration

### Step 1: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs**:
   - Add: `https://your-app.railway.app/api/users/oauth/google/callback`
   - Remove localhost URLs if deploying to production
5. Click "Save"

### Step 2: Update Railway Environment Variables

Go back to Railway and update:

```bash
FRONTEND_URL=https://your-site.netlify.app
GOOGLE_REDIRECT_URI=https://your-app.railway.app/api/users/oauth/google/callback
```

Click "Redeploy" after updating.

---

## ✅ Part 4: Test Your Deployment

1. Visit your Netlify URL: `https://your-site.netlify.app`
2. Test the following:
   - ✅ Register with email/password
   - ✅ Login with Google OAuth
   - ✅ Play offline mode
   - ✅ Create online room
   - ✅ Join online room
   - ✅ Create tournament
   - ✅ WebSocket connections work

### Common Issues & Solutions

**Issue: "CORS Error" in browser console**
- Solution: Make sure `FRONTEND_URL` is set correctly in Railway
- Check that Railway backend is running (click "View Logs")

**Issue: "Failed to fetch" errors**
- Solution: Verify `VITE_API_URL` is set in Netlify environment variables
- Redeploy Netlify after adding variables

**Issue: WebSocket connection fails**
- Solution: Check that `VITE_WS_URL` uses `wss://` (not `ws://`)
- Ensure Railway backend is running and accessible

**Issue: OAuth callback error**
- Solution: Verify `GOOGLE_REDIRECT_URI` in Railway matches Google Console
- Check Google OAuth credentials are correct

---

## 🔄 Making Updates

### Update Frontend

```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push
# Netlify will auto-deploy
```

### Update Backend

```bash
# Make changes to backend code
git add .
git commit -m "Update backend"
git push
# Railway will auto-deploy
```

---

## 💰 Cost Estimates

### Railway (Backend)
- **Free tier**: $5 credit/month
- **Hobby plan**: $5/month for 500 hours
- Expected usage: ~$5-10/month for light traffic

### Netlify (Frontend)
- **Free tier**: 100GB bandwidth, 300 build minutes/month
- More than enough for personal/demo projects
- **Pro plan**: $19/month if you need more

### Total: ~$5-10/month or FREE with trial credits!

---

## 🎓 Alternative Deployment Options

### Option 1: Both on Railway
Deploy frontend as static site on Railway alongside backend.

### Option 2: Vercel + Railway
Use Vercel instead of Netlify (similar setup).

### Option 3: Self-hosted VPS
Use DigitalOcean Droplet or any VPS with Docker Compose (original setup).

---

## 📚 Helpful Resources

- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Fastify CORS Plugin](https://github.com/fastify/fastify-cors)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Railway logs: Project → Service → "View Logs"
2. Check Netlify deploy logs: Site → "Deploys" → Click on latest deploy
3. Check browser console for errors (F12)
4. Verify all environment variables are set correctly

---

## ✨ Success!

Once deployed, share your game URL with friends:
`https://your-site.netlify.app`

Enjoy your online Pong game! 🏓

