# 🎮 Pong Game - Netlify + Railway Deployment

Your Pong game is now configured for cloud deployment!

## 📁 What Changed?

### ✅ New Configuration Files Created

1. **`railway.json`** - Railway deployment configuration
2. **`netlify.toml`** - Netlify build and deploy settings
3. **`srcs/backend/Procfile`** - Backend process definition
4. **`srcs/frontend/.env.example`** - Frontend environment variables template
5. **`srcs/frontend/src/utils/api.ts`** - API helper utility

### ✅ Code Updates

**Backend (`srcs/backend/src/`):**
- ✨ Added CORS support with `@fastify/cors`
- 🔧 Updated `server.ts` to accept `FRONTEND_URL` for CORS
- 🌍 Updated `env.ts` to include `frontendUrl` configuration

**Frontend (`srcs/frontend/src/`):**
- 🔄 Created API helper utility for environment-aware URLs
- 🔌 Updated WebSocket connection to use environment variables
- 📡 Updated all `fetch()` calls to use `apiFetch()` helper
- 🎯 Files updated:
  - `game/online.ts`
  - `components/auth-panel.ts`
  - `components/session-banner.ts`
  - `views/dashboard.ts`
  - `views/game.ts`
  - `views/tournament.ts`
  - `views/user-profile.ts`
  - `views/game-session.ts`

---

## 🚀 Quick Start

### 1️⃣ Install Backend Dependencies

```bash
cd srcs/backend
npm install @fastify/cors
```

### 2️⃣ Commit and Push to GitHub

```bash
git add .
git commit -m "Configure for Netlify + Railway deployment"
git push origin main
```

### 3️⃣ Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables (see `ENVIRONMENT_VARIABLES.md`)
4. Copy your Railway URL

### 4️⃣ Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import from GitHub
3. Configure build settings (see `DEPLOYMENT.md`)
4. Add environment variables with Railway URL
5. Deploy!

### 5️⃣ Update OAuth Settings

1. Update Google Cloud Console redirect URI
2. Update Railway `FRONTEND_URL` variable
3. Redeploy backend

---

## 📚 Documentation

Detailed guides are available:

| Document | Description |
|----------|-------------|
| 📘 **`DEPLOYMENT.md`** | Complete step-by-step deployment guide |
| 🔐 **`ENVIRONMENT_VARIABLES.md`** | All environment variables explained |
| ✅ **`DEPLOYMENT_CHECKLIST.md`** | Interactive checklist for deployment |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         User's Browser                  │
│   (https://your-site.netlify.app)      │
└────────────┬────────────────────────────┘
             │
             │ HTTPS/WSS
             ▼
┌─────────────────────────────────────────┐
│         Netlify CDN                     │
│    (Frontend - Static Files)           │
│  • HTML, CSS, JavaScript                │
│  • Optimized & Cached                   │
└────────────┬────────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────────┐
│       Railway Platform                  │
│   (https://your-app.railway.app)       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend Server (Node.js)         │ │
│  │  • Fastify REST API               │ │
│  │  • WebSocket Game Server          │ │
│  │  • JWT Authentication             │ │
│  │  • SQLite Database                │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
             │
             │ OAuth
             ▼
┌─────────────────────────────────────────┐
│      Google OAuth 2.0                   │
│   (accounts.google.com)                 │
└─────────────────────────────────────────┘
```

---

## 🔧 How It Works

### Development Mode (Local)

```bash
# Backend runs on localhost:3000
# Frontend runs on localhost:5173
# API calls use relative URLs (proxied by Vite)
make up
```

### Production Mode (Cloud)

```bash
# Frontend on Netlify CDN
VITE_API_URL → Points to Railway backend
VITE_WS_URL → Points to Railway WebSocket

# Backend on Railway
FRONTEND_URL → Points to Netlify for CORS
Serves API and WebSocket connections
```

---

## 🔐 Environment Variables

### Required for Backend (Railway)

```bash
JWT_SECRET=<64-char-random-string>
COOKIE_SECURE=true
NODE_ENV=production
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_REDIRECT_URI=<railway-url>/api/users/oauth/google/callback
FRONTEND_URL=<netlify-url>
```

### Required for Frontend (Netlify)

```bash
VITE_API_URL=<railway-backend-url>
VITE_WS_URL=<railway-backend-url-with-wss>
```

---

## 🧪 Testing Locally Before Deploy

### Test with Production-like Setup

1. **Start backend:**
   ```bash
   cd srcs/backend
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd srcs/frontend
   npm run dev
   ```

3. **Test features:**
   - Authentication
   - Offline game
   - Online game
   - Tournaments

---

## 💰 Cost Estimate

### Free Tier (Perfect for Testing)

- **Railway**: $5 credit/month (enough for ~500 hours)
- **Netlify**: 100GB bandwidth/month
- **Total**: FREE for low-traffic projects

### Paid Tier (For Production)

- **Railway Hobby**: $5/month
- **Netlify Pro**: $19/month (optional)
- **Total**: ~$5-25/month

---

## 🆘 Common Issues

### "CORS Error"
**Problem:** Frontend can't access backend
**Solution:** Check `FRONTEND_URL` in Railway matches Netlify URL exactly

### "Failed to connect to WebSocket"
**Problem:** WebSocket URL is incorrect
**Solution:** Use `wss://` (not `ws://`) in `VITE_WS_URL`

### "OAuth callback error"
**Problem:** Google redirect URI mismatch
**Solution:** Update Google Console with Railway URL

### "Environment variable undefined"
**Problem:** Variables not loaded
**Solution:** Redeploy after adding variables in dashboard

---

## 📊 Monitoring

### Check Backend Health

```bash
curl https://your-app.railway.app/health
```

### Check Metrics

```bash
curl https://your-app.railway.app/metrics
```

### View Logs

- **Railway**: Project → Service → View Logs
- **Netlify**: Site → Deploys → Deploy Logs

---

## 🎯 Next Steps

After deployment:

1. ✅ Test all features
2. 🔗 Share your game URL
3. 📊 Set up analytics (optional)
4. 🌐 Add custom domain (optional)
5. 📈 Monitor usage and costs
6. 🔒 Review security settings

---

## 🤝 Contributing

If you want to update the deployment:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Railway and Netlify auto-deploy!

---

## 📞 Support

If you need help:

1. Check `DEPLOYMENT.md` for detailed steps
2. Review `DEPLOYMENT_CHECKLIST.md` for common issues
3. Check Railway and Netlify logs
4. Review browser console (F12) for frontend errors

---

## 🎉 Success!

Your Pong game is ready for the cloud! 🚀

**Frontend**: Served globally via Netlify CDN
**Backend**: Running on Railway with WebSocket support
**Database**: Persistent SQLite on Railway volumes
**OAuth**: Integrated with Google authentication

Enjoy your deployment! 🏓

---

## 📝 License

[Your License Here]

## 👤 Author

[Your Name]

---

**Happy Gaming! 🎮**


