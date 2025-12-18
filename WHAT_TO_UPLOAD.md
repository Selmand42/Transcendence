# 📤 What to Upload to GitHub for Railway Deployment

## ✅ Files You MUST Upload

### Root Directory
```
✅ railway.json          - Railway configuration (UPDATED)
✅ nixpacks.toml        - Nixpacks build configuration (NEW!)
✅ netlify.toml         - Netlify configuration
✅ .gitignore           - Git ignore rules
✅ Makefile             - Build commands (optional)
✅ readme.md            - Project documentation
```

### Backend Files (`srcs/backend/`)
```
✅ package.json         - Backend dependencies (MUST HAVE!)
✅ package-lock.json    - Locked dependency versions (MUST HAVE!)
✅ Procfile             - Process definition
✅ tsconfig.json        - TypeScript configuration
✅ src/                 - All source code files
   ✅ server.ts
   ✅ database.ts
   ✅ env.ts
   ✅ game-ws.ts
   ✅ rate-limit.ts
```

### Frontend Files (`srcs/frontend/`)
```
✅ package.json         - Frontend dependencies
✅ package-lock.json    - Locked dependency versions
✅ index.html           - Entry HTML
✅ vite.config.ts       - Vite configuration
✅ tsconfig.json        - TypeScript configuration
✅ tailwind.config.js   - Tailwind CSS config
✅ postcss.config.js    - PostCSS config
✅ src/                 - All source code
   ✅ main.ts
   ✅ components/
   ✅ game/
   ✅ router/
   ✅ utils/
   ✅ views/
✅ .env.example         - Environment template
```

---

## ❌ Files You Should NOT Upload

```
❌ node_modules/        - Dependencies (too large, auto-installed)
❌ .env                 - Environment variables (secrets!)
❌ srcs/backend/.env    - Backend secrets
❌ dist/                - Build output (generated during build)
❌ srcs/backend/dist/   - Backend compiled files
❌ srcs/frontend/dist/  - Frontend build files
❌ srcs/backend/data/   - SQLite database (Railway creates new one)
❌ srcs/docker/nginx/certs/ - SSL certificates
❌ .DS_Store            - macOS artifacts
```

---

## 🔧 Step-by-Step: What to Do

### Step 1: Install Backend Dependencies

**IMPORTANT**: Install `@fastify/cors` before pushing!

```bash
cd srcs/backend
npm install @fastify/cors
```

This will update `package.json` and `package-lock.json`.

### Step 2: Check What's Being Tracked

```bash
# Make sure you're in the project root
cd /Users/selmandemir/Desktop/sonfalan

# See what Git will track
git status

# Add all necessary files
git add .
```

### Step 3: Commit Everything

```bash
git commit -m "Configure for Railway deployment

- Add nixpacks.toml for proper build configuration
- Update railway.json with simplified config
- Add @fastify/cors to backend dependencies
- Update all API calls to use environment variables
- Ready for cloud deployment"
```

### Step 4: Push to GitHub

```bash
# If you haven't created a repo yet:
gh repo create sonfalan --public --source=. --remote=origin --push

# Or if repo exists:
git push origin main
```

---

## 🐛 Troubleshooting Railway Build Failures

### Error: "Cannot find package.json"

**Problem**: Railway can't find backend package.json
**Solution**: Make sure these files exist in `srcs/backend/`:
- `package.json`
- `package-lock.json`

Check with:
```bash
ls -la srcs/backend/package*.json
```

### Error: "Build command failed"

**Problem**: The build command can't run
**Solution**:
1. Make sure `nixpacks.toml` is in the root directory
2. Verify `srcs/backend/package.json` has the build script:
```json
{
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "start": "node --enable-source-maps dist/src/server.js"
  }
}
```

### Error: "Module not found: @fastify/cors"

**Problem**: Missing dependency
**Solution**:
```bash
cd srcs/backend
npm install @fastify/cors
git add package.json package-lock.json
git commit -m "Add @fastify/cors dependency"
git push
```

### Error: "ENOENT: no such file or directory"

**Problem**: Path issues in start command
**Solution**: The `nixpacks.toml` should have fixed this. Make sure it's in your repo root.

---

## ✅ Verify Before Pushing

Run this checklist:

```bash
# 1. Check backend package.json exists and has @fastify/cors
cat srcs/backend/package.json | grep "@fastify/cors"

# 2. Check nixpacks.toml exists
ls nixpacks.toml

# 3. Check railway.json exists
ls railway.json

# 4. Check no .env files are staged
git status | grep -E "\.env$"
# (should show nothing)

# 5. Check all source files are staged
git status
```

---

## 📦 Complete Upload Checklist

Before pushing to GitHub:

- [ ] `@fastify/cors` installed in backend
  ```bash
  cd srcs/backend && npm install @fastify/cors
  ```
- [ ] `package-lock.json` updated
- [ ] `nixpacks.toml` created in root
- [ ] `railway.json` updated
- [ ] All source code files in `srcs/backend/src/`
- [ ] All source code files in `srcs/frontend/src/`
- [ ] `.gitignore` prevents uploading secrets
- [ ] No `node_modules/` folders staged
- [ ] No `.env` files staged
- [ ] No `dist/` folders staged

---

## 🚀 After Pushing to GitHub

### Deploy on Railway:

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway will:
   - ✅ Read `nixpacks.toml`
   - ✅ Read `railway.json`
   - ✅ Install dependencies from `srcs/backend/package.json`
   - ✅ Build with TypeScript
   - ✅ Start the server
6. Add environment variables (see `ENVIRONMENT_VARIABLES.md`)
7. Generate domain
8. Done! 🎉

---

## 📊 What Railway Does During Build

```
1. Clone your repository
2. Read nixpacks.toml
3. Install Node.js 20
4. cd srcs/backend
5. Run: npm ci (install from package-lock.json)
6. Run: npm run build (compile TypeScript)
7. Run: npm start (start the server)
```

---

## 🔍 Verify Your Upload

After pushing, check on GitHub:

**Required files should be visible:**
- `railway.json` ✅
- `nixpacks.toml` ✅
- `srcs/backend/package.json` ✅
- `srcs/backend/package-lock.json` ✅
- `srcs/backend/src/server.ts` ✅

**These should NOT be visible:**
- `node_modules/` ❌
- `.env` ❌
- `srcs/backend/dist/` ❌

---

## 💡 Quick Reference

```bash
# Install dependencies
cd srcs/backend && npm install @fastify/cors

# Check what will be uploaded
git status

# Add everything
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Push
git push origin main

# Deploy on Railway
# Go to railway.app → New Project → Deploy from GitHub
```

---

## ❓ Still Having Issues?

If Railway build still fails:

1. **Check Railway logs**:
   - Go to your project on Railway
   - Click on the service
   - Click "View Logs"
   - Look for error messages

2. **Common fixes**:
   - Make sure `nixpacks.toml` is in root directory
   - Verify `package.json` paths are correct
   - Check that all imports in TypeScript files are correct
   - Ensure TypeScript can compile locally: `cd srcs/backend && npm run build`

3. **Test build locally**:
   ```bash
   cd srcs/backend
   rm -rf dist node_modules
   npm install
   npm run build
   npm start
   ```

   If this works, Railway should work too!

---

**Summary**: Upload everything EXCEPT `node_modules/`, `.env`, and `dist/` folders. The `nixpacks.toml` file will handle the build! 🚀


