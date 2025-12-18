# 🔐 Environment Variables Reference

## Backend (Railway)

Create these in Railway project settings:

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `JWT_SECRET` | `a1b2c3d4e5f6...` (64+ chars) | Secret key for JWT token signing |
| `COOKIE_SECURE` | `true` | Enable secure cookies (HTTPS only) |
| `NODE_ENV` | `production` | Node environment |
| `GOOGLE_CLIENT_ID` | `123456789-abc.apps.googleusercontent.com` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxxx` | From Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `https://your-app.railway.app/api/users/oauth/google/callback` | OAuth callback URL |
| `FRONTEND_URL` | `https://your-site.netlify.app` | Your Netlify frontend URL (for CORS) |
| `PORT` | `3000` | Server port (Railway auto-detects) |
| `HOST` | `0.0.0.0` | Server host |

### How to Generate JWT_SECRET

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64

# Option 3: Online generator
# Visit: https://randomkeygen.com/
```

---

## Frontend (Netlify)

Add these in Netlify: Site Settings → Environment Variables:

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `VITE_API_URL` | `https://your-app.railway.app` | Backend API URL (from Railway) |
| `VITE_WS_URL` | `wss://your-app.railway.app` | WebSocket URL (same as API but with wss://) |

**Important Notes:**
- Vite environment variables must start with `VITE_`
- Use `https://` for API URL
- Use `wss://` for WebSocket URL (secure WebSocket)
- Do NOT include trailing slashes

---

## Local Development

For local development, copy the example file:

### Frontend (.env.development)

Create `srcs/frontend/.env.development`:

```bash
# Leave empty for local development (uses relative URLs)
VITE_API_URL=
VITE_WS_URL=
```

### Backend (.env)

Copy `srcs/backend/.env.example` to `srcs/backend/.env`:

```bash
JWT_SECRET=local-dev-secret-min-32-characters-long
COOKIE_SECURE=false
NODE_ENV=development
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://localhost:8443/api/users/oauth/google/callback
FRONTEND_URL=https://localhost:8443
PORT=3000
HOST=0.0.0.0
```

---

## Security Best Practices

1. ✅ **Never commit** `.env` files to Git
2. ✅ **Use different secrets** for development and production
3. ✅ **Rotate secrets** periodically (especially JWT_SECRET)
4. ✅ **Keep COOKIE_SECURE=true** in production
5. ✅ **Use strong, random values** for JWT_SECRET (64+ characters)

---

## Verifying Configuration

### Check Backend Variables (Railway)

In Railway:
1. Go to your project
2. Click on service
3. Go to "Variables" tab
4. Verify all variables are set

### Check Frontend Variables (Netlify)

In Netlify:
1. Go to your site
2. Click "Site settings"
3. Go to "Environment variables"
4. Verify VITE_API_URL and VITE_WS_URL are set

### Test in Browser

After deployment, open browser console (F12) and run:

```javascript
// Check if environment variables are loaded
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('WS URL:', import.meta.env.VITE_WS_URL);
```

---

## Troubleshooting

### "JWT_SECRET is required" error
- Make sure JWT_SECRET is set in Railway variables
- It must be at least 32 characters long

### CORS errors
- Verify FRONTEND_URL matches your Netlify URL exactly
- Check for trailing slashes (they should NOT be present)

### WebSocket connection fails
- Make sure VITE_WS_URL uses `wss://` (not `ws://`)
- Verify Railway backend is running

### OAuth redirect error
- GOOGLE_REDIRECT_URI must exactly match the URL in Google Console
- Must use your Railway backend URL

---

## Example: Complete Setup

### Railway Environment Variables
```
JWT_SECRET=f8e9d7c6b5a4938271605f4e3d2c1b0a9f8e7d6c5b4a3928170615243f2e1d0c
COOKIE_SECURE=true
NODE_ENV=production
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWx
GOOGLE_REDIRECT_URI=https://pong-game-production.railway.app/api/users/oauth/google/callback
FRONTEND_URL=https://pong-game.netlify.app
PORT=3000
HOST=0.0.0.0
```

### Netlify Environment Variables
```
VITE_API_URL=https://pong-game-production.railway.app
VITE_WS_URL=wss://pong-game-production.railway.app
```

Perfect! ✨


