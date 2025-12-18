# ✅ Deployment Checklist

Use this checklist to ensure everything is configured correctly.

## 📦 Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] `@fastify/cors` package is installed in backend
  ```bash
  cd srcs/backend
  npm install @fastify/cors
  git add package.json package-lock.json
  git commit -m "Add CORS support"
  git push
  ```
- [ ] All local changes are committed and pushed

---

## 🚂 Railway Backend Setup

- [ ] Railway account created
- [ ] New project created from GitHub repository
- [ ] Railway detected `railway.json` configuration
- [ ] Environment variables configured:
  - [ ] `JWT_SECRET` (64+ character random string)
  - [ ] `COOKIE_SECURE=true`
  - [ ] `NODE_ENV=production`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `GOOGLE_REDIRECT_URI` (Railway backend URL + callback path)
  - [ ] `FRONTEND_URL` (will add after Netlify deployment)
  - [ ] `PORT=3000`
  - [ ] `HOST=0.0.0.0`
- [ ] Domain generated in Railway
- [ ] Backend URL saved: `_________________________`
- [ ] Deployment successful (check logs)
- [ ] Backend accessible at the URL

---

## 🌐 Netlify Frontend Setup

- [ ] Netlify account created
- [ ] New site created from GitHub repository
- [ ] Build settings configured:
  - [ ] Base directory: `srcs/frontend`
  - [ ] Build command: `npm install && npm run build`
  - [ ] Publish directory: `srcs/frontend/dist`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` (Railway backend URL)
  - [ ] `VITE_WS_URL` (Railway backend URL with wss://)
- [ ] Site URL saved: `_________________________`
- [ ] Deployment successful
- [ ] Site accessible and loads

---

## 🔐 Google OAuth Configuration

- [ ] Google Cloud Console project exists
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs updated:
  - [ ] Railway callback URL added
  - [ ] Localhost URLs removed (if production)
- [ ] Client ID and Secret copied to Railway variables

---

## 🔄 Post-Deployment Updates

- [ ] Go back to Railway
- [ ] Update `FRONTEND_URL` with Netlify URL
- [ ] Redeploy Railway backend
- [ ] Wait for deployment to complete

---

## 🧪 Testing

Test each feature to ensure everything works:

### Authentication
- [ ] Register with email/password works
- [ ] Login with email/password works
- [ ] Login with Google OAuth works
- [ ] Logout works
- [ ] Session persists across page refreshes

### Game Features
- [ ] Offline mode (vs AI) works
- [ ] Online mode - create room works
- [ ] Online mode - join room works
- [ ] WebSocket connection stable
- [ ] Scores update correctly
- [ ] Game ends properly

### Tournament Features
- [ ] Can create tournament
- [ ] Can join tournament
- [ ] Can start tournament
- [ ] Tournament bracket displays
- [ ] Tournament matches work

### Profile & Social
- [ ] Profile displays correctly
- [ ] Can update nickname
- [ ] Can upload avatar
- [ ] Can add friends
- [ ] Game history shows

---

## 🐛 Troubleshooting

If something doesn't work, check:

### Backend Issues
- [ ] Railway logs show no errors
  - Railway → Your Project → View Logs
- [ ] All environment variables are set
- [ ] Backend URL is accessible
  - Test: `curl https://your-app.railway.app/health`

### Frontend Issues
- [ ] Netlify build succeeded
  - Netlify → Deploys → Latest Deploy
- [ ] Environment variables are set
  - Netlify → Site Settings → Environment Variables
- [ ] No console errors in browser (F12)

### CORS Issues
- [ ] `FRONTEND_URL` exactly matches Netlify URL
- [ ] No trailing slashes in URLs
- [ ] Backend redeployed after updating `FRONTEND_URL`

### OAuth Issues
- [ ] Google Console redirect URI matches Railway URL
- [ ] `GOOGLE_REDIRECT_URI` matches Google Console
- [ ] Client ID and Secret are correct

### WebSocket Issues
- [ ] `VITE_WS_URL` uses `wss://` (not `ws://`)
- [ ] Railway backend is running
- [ ] No firewall blocking WebSocket

---

## 📊 Performance Checks

- [ ] Frontend loads in < 3 seconds
- [ ] API responses are fast (< 500ms)
- [ ] WebSocket latency is acceptable
- [ ] No memory leaks in long sessions

---

## 🎉 Launch!

When all items are checked:

- [ ] Share your game URL with friends
- [ ] Add custom domain (optional)
- [ ] Set up monitoring/analytics (optional)
- [ ] Celebrate! 🎊

---

## 📝 Important URLs

Save these for reference:

| Service | URL |
|---------|-----|
| Frontend (Netlify) | `https://_________________________.netlify.app` |
| Backend (Railway) | `https://_________________________.railway.app` |
| GitHub Repo | `https://github.com/___________________________` |
| Railway Dashboard | `https://railway.app/project/_______________` |
| Netlify Dashboard | `https://app.netlify.com/sites/______________` |
| Google Console | `https://console.cloud.google.com/apis/credentials` |

---

## 🔒 Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] `COOKIE_SECURE=true` in production
- [ ] Strong JWT_SECRET (64+ chars)
- [ ] HTTPS enforced (automatic on Railway/Netlify)
- [ ] OAuth redirect URIs are exact matches

---

## 💰 Cost Monitoring

Set up billing alerts:

- [ ] Railway usage monitoring enabled
- [ ] Netlify bandwidth monitoring enabled
- [ ] Expected monthly cost: ~$5-10

---

**Good luck with your deployment! 🚀**


