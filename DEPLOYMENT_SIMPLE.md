# 🔽 Super Simple Deployment Guide (Railway + Netlify)

This is the **short, practical version**. Just follow the steps in order.

---

## 1. Prepare the project

1. Open a terminal in your project folder:
   ```bash
   cd /Users/selmandemir/Desktop/sonfalan
   ```
2. Make sure dependencies are installed (once):
   ```bash
   cd srcs/backend && npm install
   cd ../frontend && npm install
   ```
3. Install CORS in the backend (only if not already installed):
   ```bash
   cd srcs/backend
   npm install @fastify/cors
   ```

> If you get stuck anywhere, you can check the detailed docs later: `DEPLOYMENT.md`, `ENVIRONMENT_VARIABLES.md`.

---

## 2. Put the code on GitHub (one time)

1. Create a GitHub repo (for example called `sonfalan`).
2. In your terminal (from the project root):
   ```bash
   cd /Users/selmandemir/Desktop/sonfalan
   git add .
   git commit -m "Initial deployment setup"
   git branch -M main
   git remote add origin git@github.com:<your-username>/sonfalan.git
   git push -u origin main
   ```

Now Railway and Netlify will pull code from this repo.

---

## 3. Deploy the backend on Railway

1. Go to `https://railway.app` and sign in.
2. Click **New Project → Deploy from GitHub repo**.
3. Pick your `sonfalan` repo.
4. Wait until it finishes the first build.
5. When it’s done, open the service → **Settings → Networking → Generate Domain**.
6. Copy this URL, it looks like:
   - `https://your-app-name.up.railway.app`

### 3.1 Set backend environment variables on Railway

In your Railway project → service → **Variables** tab, add:

```text
JWT_SECRET = a-long-random-string (at least 32 chars)
COOKIE_SECURE = true
NODE_ENV = production
GOOGLE_CLIENT_ID = (from Google, optional but needed for Google login)
GOOGLE_CLIENT_SECRET = (from Google, optional)
GOOGLE_REDIRECT_URI = https://your-app-name.up.railway.app/api/users/oauth/google/callback
FRONTEND_URL = (leave empty for now, we’ll fill after Netlify is ready)
PORT = 3000
HOST = 0.0.0.0
```

To quickly generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Then click **Deploy / Redeploy** so the backend restarts with these variables.

---

## 4. Deploy the frontend on Netlify

1. Go to `https://app.netlify.com` and sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize, then pick your `sonfalan` repo.
4. Configure build settings:
   - **Base directory**: `srcs/frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `srcs/frontend/dist`
   - (Node version: if there’s an option, choose 20)
5. Before clicking deploy, add environment variables:
   - `VITE_API_URL` = `https://your-app-name.up.railway.app`
   - `VITE_WS_URL` = `wss://your-app-name.up.railway.app`
6. Click **Deploy**.

After deploy completes, Netlify gives you a URL like:
- `https://your-site-name.netlify.app`

Copy this URL.

---

## 5. Connect backend and frontend

Go back to your **Railway** project → service → **Variables** and set:

```text
FRONTEND_URL = https://your-site-name.netlify.app
```

Save, then **Redeploy** the Railway service.

Now:
- Frontend (Netlify) calls backend using `VITE_API_URL`.
- Backend (Railway) allows that frontend via `FRONTEND_URL`.

---

## 6. Google OAuth (only if you want Google login)

1. Go to `https://console.cloud.google.com` → **APIs & Services → Credentials**.
2. Create or edit an **OAuth 2.0 Client ID**.
3. In **Authorized redirect URIs**, add:
   - `https://your-app-name.up.railway.app/api/users/oauth/google/callback`
4. Copy **Client ID** and **Client Secret** into Railway variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (same as above)
5. Redeploy the Railway backend.

If you don’t care about Google login, you can skip this entire step.

---

## 7. Test the live app

1. Open your Netlify URL in the browser:
   - `https://your-site-name.netlify.app`
2. Check:
   - You can open the site without errors.
   - You can register / login (and Google login if enabled).
   - You can play a game (offline and online).

If something is broken:
- Check Railway logs (Backend): project → service → **View Logs**.
- Check Netlify deploy logs: site → **Deploys**.
- Open Browser DevTools (F12) → **Console** to see errors.

---

## 8. Updating the app later

When you change code:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update game"
   git push
   ```
2. Railway and Netlify will automatically redeploy with the new code.

That’s it — these are the **minimum steps** you need. For more explanations and edge cases, see the detailed docs:
- `DEPLOYMENT.md`
- `DEPLOYMENT_CHECKLIST.md`
- `ENVIRONMENT_VARIABLES.md`
