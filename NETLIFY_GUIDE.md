# 🌐 Netlify Deployment Guide - BuzzYatra

## ⚠️ IMPORTANT: You need to create 2 SEPARATE Netlify sites

You cannot deploy both Landing and Frontend in one Netlify site. Each needs its own deployment.

---

## 🚀 Deployment Process

### Site 1: Landing Page

1. **Go to Netlify Dashboard**
   - Visit https://netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect Repository**
   - Choose "Deploy with GitHub"
   - Select your `BuzzYatra` repository
   - Click "Authorize Netlify"

3. **Configure Build Settings**
   ```
   Base directory: Landing
   Build command: npm run build
   Publish directory: Landing/dist
   ```

4. **Add Environment Variable**
   - Click "Show advanced"
   - Add environment variable:
     - Key: `VITE_FRONTEND_URL`
     - Value: `https://your-frontend-site.netlify.app` (temporary - update after step 2)
   
   For now, use: `http://localhost:5173` (you'll update this later)

5. **Deploy Site**
   - Click "Deploy site"
   - Wait for deployment to complete
   - **Copy the URL**: e.g., `https://buzzyatra-landing.netlify.app`

6. **Optional: Change Site Name**
   - Go to Site settings → General → Site details
   - Change site name to something memorable like `buzzyatra-landing`

---

### Site 2: Frontend App

1. **Create Another Site**
   - Back to Netlify dashboard
   - Click "Add new site" → "Import an existing project"

2. **Connect Same Repository**
   - Choose GitHub
   - Select `BuzzYatra` repository again (yes, same repo!)

3. **Configure Build Settings** (DIFFERENT from Landing!)
   ```
   Base directory: Frontend
   Build command: npm run build
   Publish directory: Frontend/dist
   ```

4. **Add Environment Variable**
   - Click "Show advanced"
   - Add environment variable:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://your-backend.onrender.com/api`
   
   If you haven't deployed backend yet, use: `http://localhost:4000/api`

5. **Deploy Site**
   - Click "Deploy site"
   - Wait for deployment to complete
   - **Copy the URL**: e.g., `https://buzzyatra-app.netlify.app`

6. **Optional: Change Site Name**
   - Site settings → General → Site details
   - Change to `buzzyatra-app`

---

## 🔄 Update Environment Variables

### Update Landing Site

Now that you have the Frontend URL, update the Landing site:

1. Go to Landing site on Netlify
2. Site settings → Environment variables
3. Edit `VITE_FRONTEND_URL`
4. Change value to: `https://buzzyatra-app.netlify.app` (your actual Frontend URL)
5. Click "Save"
6. Go to Deploys → Trigger deploy → "Deploy site"

---

### Update Frontend Site

If you deployed backend:

1. Go to Frontend site on Netlify
2. Site settings → Environment variables
3. Edit `VITE_API_BASE_URL`
4. Change value to: `https://your-backend.onrender.com/api`
5. Click "Save"
6. Go to Deploys → Trigger deploy → "Deploy site"

---

## 📋 Summary of Your Deployments

After following the steps, you'll have:

| Site | Netlify Project | URL | Base Directory |
|------|----------------|-----|----------------|
| **Landing** | buzzyatra-landing | `https://buzzyatra-landing.netlify.app` | `Landing` |
| **Frontend** | buzzyatra-app | `https://buzzyatra-app.netlify.app` | `Frontend` |

Plus:
| **Backend** | Render/Railway | `https://buzzyatra-backend.onrender.com` | N/A |

---

## 🔧 Configuration Files Location

Each folder has its own `netlify.toml`:

- `Landing/netlify.toml` ✅ (used by Landing site)
- `Frontend/netlify.toml` ✅ (used by Frontend site)
- `netlify.toml` (root) ❌ (NOT used - just documentation)

---

## ✅ Environment Variables Checklist

### Landing Site Environment Variables
```
VITE_FRONTEND_URL = https://buzzyatra-app.netlify.app
```

### Frontend Site Environment Variables
```
VITE_API_BASE_URL = https://buzzyatra-backend.onrender.com/api
```

### Backend (Render/Railway) Environment Variables
```
MONGO_URI = mongodb+srv://...
ORS_API_KEY = ...
TWILIO_ACCOUNT_SID = ...
TWILIO_AUTH_TOKEN = ...
TWILIO_PHONE_NUMBER = ...
PORT = 4000
NODE_ENV = production
FRONTEND_URL = https://buzzyatra-app.netlify.app
LANDING_URL = https://buzzyatra-landing.netlify.app
```

---

## 🎯 Testing Your Deployment

1. **Visit Landing Page**
   - URL: `https://buzzyatra-landing.netlify.app`
   - Click "Get Started" button
   - Should redirect to: `https://buzzyatra-app.netlify.app`

2. **Test Frontend**
   - URL: `https://buzzyatra-app.netlify.app`
   - Open browser console (F12)
   - Check for errors
   - Try adding an emergency contact
   - Should make API call to backend

3. **Test SOS System**
   - Add emergency contact with phone number
   - Click SOS button
   - Should send SMS via Twilio

---

## 🔄 Auto-Deploy on Git Push

Both Netlify sites are connected to your GitHub repo:

- **Push to GitHub** → Both sites auto-rebuild
- **No manual intervention needed**
- **Check Netlify dashboard** for deployment status

---

## 🐛 Common Issues

### Issue: "Build failed" on Netlify

**Check:**
- Base directory is set correctly
- Build command is `npm run build`
- Publish directory matches (e.g., `Frontend/dist` not just `dist`)

**Solution:**
```
Site settings → Build & deploy → Build settings
Verify:
  Base directory: Frontend (or Landing)
  Build command: npm run build
  Publish directory: Frontend/dist (or Landing/dist)
```

### Issue: Environment variables not working

**Solution:**
- Netlify env vars require `VITE_` prefix for Vite apps
- After changing env vars, trigger new deploy
- Clear browser cache and test again

### Issue: 404 on page refresh

**Solution:**
- Already configured in `netlify.toml` files
- Redirects `/*` to `/index.html`
- If still failing, check `netlify.toml` is in correct folder

---

## 📱 Custom Domains (Optional)

### For Landing Page
1. Netlify → Landing site → Domain settings
2. Add custom domain: `buzzyatra.com`
3. Follow DNS setup instructions
4. **Update Frontend redirect** if needed

### For Frontend App
1. Netlify → Frontend site → Domain settings
2. Add custom domain: `app.buzzyatra.com`
3. Follow DNS setup instructions
4. **Update** Landing's `VITE_FRONTEND_URL` to new domain
5. **Update** Backend's `FRONTEND_URL` to new domain

---

## 💡 Pro Tips

1. **Site Names**: Use descriptive names (e.g., `buzzyatra-landing`, `buzzyatra-app`)
2. **Deploy Previews**: Netlify creates preview URLs for pull requests
3. **Build Logs**: Check deployment logs if builds fail
4. **Rollbacks**: Can rollback to previous deployments easily
5. **Branch Deploys**: Can deploy different branches to different URLs

---

## 📞 Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Build Issues**: Check Netlify deploy logs
- **Environment Issues**: Verify env vars in Site settings
- **DNS Issues**: Can take 24-48 hours to propagate

---

**Your project is ready to deploy! 🚀**
