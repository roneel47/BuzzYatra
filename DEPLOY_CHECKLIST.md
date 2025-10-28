# 🚀 BuzzYatra - Ready-to-Deploy Checklist

## ✅ Pre-Deployment Checklist

### 1. Local Testing
- [ ] All projects build successfully (`npm run build:all`)
- [ ] All projects run locally (`npm run dev`)
- [ ] Frontend connects to Backend API
- [ ] Landing page redirects to Frontend
- [ ] SOS system works (SMS sending)
- [ ] Emergency contacts CRUD operations work
- [ ] Route planning works

### 2. Environment Files Ready
- [ ] `Backend/.env.example` created ✅
- [ ] `Frontend/.env.example` created ✅
- [ ] `Landing/.env.example` created ✅
- [ ] `.env.production.example` created ✅
- [ ] All sensitive data removed from git ✅

### 3. Configuration Files
- [ ] `Frontend/netlify.toml` created ✅
- [ ] `Landing/netlify.toml` created ✅
- [ ] `.gitignore` updated ✅
- [ ] CORS configured in Backend ✅

### 4. Code Updates
- [ ] Frontend uses `VITE_API_BASE_URL` ✅
- [ ] Landing uses `VITE_FRONTEND_URL` ✅
- [ ] Backend uses environment variables ✅
- [ ] All hardcoded URLs removed ✅

---

## 📋 Deployment Steps

### Step 1: Deploy Backend (Render/Railway)

**Choose One Platform:**

#### Option A: Render.com
1. Sign up at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Name**: `buzzyatra-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Environment Variables (copy from `Backend/.env`):
   ```
   MONGO_URI=your_value
   ORS_API_KEY=your_value
   TWILIO_ACCOUNT_SID=your_value
   TWILIO_AUTH_TOKEN=your_value
   TWILIO_PHONE_NUMBER=your_value
   PORT=4000
   NODE_ENV=production
   ```
6. Deploy
7. **Copy deployed URL**: `https://buzzyatra-backend.onrender.com`

#### Option B: Railway.app
1. Sign up at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Settings:
   - **Root Directory**: `Backend`
   - **Start Command**: `npm start`
5. Add environment variables (same as above)
6. Deploy
7. **Copy deployed URL**

**✅ Backend Deployed!**

---

### Step 2: Deploy Frontend (Netlify)

1. Sign up at [netlify.com](https://netlify.com)
2. Add new site → Import from Git
3. Connect GitHub repository
4. Build settings:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
5. Environment variables:
   - `VITE_API_BASE_URL` = `https://buzzyatra-backend.onrender.com/api`
     (Use URL from Step 1)
6. Deploy site
7. **Copy deployed URL**: `https://buzzyatra-app.netlify.app`

**✅ Frontend Deployed!**

---

### Step 3: Deploy Landing Page (Netlify)

1. On Netlify → Add new site
2. Import from Git → Same repository
3. Build settings:
   - **Base directory**: `Landing`
   - **Build command**: `npm run build`
   - **Publish directory**: `Landing/dist`
4. Environment variables:
   - `VITE_FRONTEND_URL` = `https://buzzyatra-app.netlify.app`
     (Use URL from Step 2)
5. Deploy site
6. **Copy deployed URL**: `https://buzzyatra.netlify.app`

**✅ Landing Deployed!**

---

### Step 4: Update Backend CORS

1. Go to Backend deployment (Render/Railway)
2. Add these environment variables:
   ```
   FRONTEND_URL=https://buzzyatra-app.netlify.app
   LANDING_URL=https://buzzyatra.netlify.app
   ```
   (Use your actual Netlify URLs from Steps 2 & 3)
3. Redeploy or restart the backend

**✅ CORS Configured!**

---

## 🧪 Post-Deployment Testing

### Test Landing Page
1. Visit: `https://buzzyatra.netlify.app`
2. Click "Get Started" button
3. Should redirect to: `https://buzzyatra-app.netlify.app`

### Test Frontend
1. Visit: `https://buzzyatra-app.netlify.app`
2. Open browser DevTools → Console
3. Check for errors
4. Try adding emergency contact
5. Should save to backend successfully

### Test SOS System
1. Add at least one emergency contact
2. Click SOS button
3. Should send SMS via Twilio
4. Check backend logs for confirmation

### Test API Connection
1. Open DevTools → Network tab
2. Perform any action (add contact, etc.)
3. Check API calls go to: `https://buzzyatra-backend.onrender.com/api/...`
4. Verify responses are successful (200 status)

---

## 🎯 URLs Summary

After deployment, you'll have:

| Service | URL | Platform |
|---------|-----|----------|
| Landing | `https://buzzyatra.netlify.app` | Netlify |
| Frontend | `https://buzzyatra-app.netlify.app` | Netlify |
| Backend | `https://buzzyatra-backend.onrender.com` | Render |

---

## 🔧 Continuous Deployment

All platforms support auto-deployment:

- **Push to GitHub** → Automatic rebuild & deploy
- **No manual intervention needed**
- **Check deployment logs** for any errors

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error in Browser
**Solution:** 
- Ensure `FRONTEND_URL` and `LANDING_URL` are set in Backend
- URLs must match exactly (no trailing slashes)
- Redeploy Backend after adding variables

### Issue: API calls fail (404)
**Solution:**
- Check `VITE_API_BASE_URL` in Frontend includes `/api`
- Example: `https://backend.onrender.com/api` ✅
- Not: `https://backend.onrender.com` ❌

### Issue: Build fails on Netlify
**Solution:**
- Check Node version (should be 18+)
- Verify `package.json` has all dependencies
- Check build logs for specific errors
- Ensure base directory is correct

### Issue: Backend doesn't start
**Solution:**
- Check all environment variables are set
- Verify MongoDB connection string
- Check Render/Railway logs
- Ensure PORT is set to 4000

### Issue: Twilio SMS not sending
**Solution:**
- Verify Twilio credentials in Backend env vars
- Check Twilio account status
- Ensure phone numbers are verified (trial accounts)
- Check Backend logs for Twilio errors

---

## 📱 Optional: Custom Domains

### Add Custom Domain to Landing
1. Netlify → Site settings → Domain management
2. Add custom domain: `buzzyatra.com`
3. Update DNS records as instructed
4. **Update** `VITE_FRONTEND_URL` if Frontend also has custom domain

### Add Custom Domain to Frontend
1. Netlify → Site settings → Domain management
2. Add custom domain: `app.buzzyatra.com`
3. Update DNS records
4. **Update** Landing's `VITE_FRONTEND_URL` to new domain
5. **Update** Backend's `FRONTEND_URL` to new domain

### Add Custom Domain to Backend
1. Render → Settings → Custom domains
2. Add domain: `api.buzzyatra.com`
3. Update DNS records
4. **Update** Frontend's `VITE_API_BASE_URL` to new domain
5. **Redeploy** Frontend after updating

---

## ✅ Final Checklist

After deployment:

- [ ] Landing page loads correctly
- [ ] "Get Started" redirects to Frontend
- [ ] Frontend loads without errors
- [ ] Can add emergency contacts
- [ ] Can view emergency contacts
- [ ] Can delete emergency contacts
- [ ] SOS button sends SMS
- [ ] No CORS errors in console
- [ ] All API calls succeed
- [ ] Route planning works
- [ ] Location services work

---

## 🎉 Deployment Complete!

Your BuzzYatra application is now live and ready to use!

**Next Steps:**
- Monitor application logs
- Set up error tracking (Sentry, etc.)
- Add analytics (Google Analytics, etc.)
- Plan feature updates
- Gather user feedback

---

## 📞 Need Help?

- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Check [DEVELOPER.md](./DEVELOPER.md) for development guide
- Open GitHub issue for bugs or questions

---

**Made with ❤️ for Bengaluru commuters**
