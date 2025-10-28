# 🔧 Backend Deployment Guide - BuzzYatra

## ⚠️ IMPORTANT: Backend Cannot Be Deployed to Netlify

Netlify is for **static sites** (HTML, CSS, JS files). Your Backend is a **Node.js server** that needs to run continuously.

---

## 🎯 Backend Deployment Options

Choose ONE of these platforms:

### 1. **Render.com** (Recommended - Free Tier Available)
### 2. **Railway.app** (Easy to use - Free Trial)
### 3. **Heroku** (Paid)
### 4. **Vercel** (Supports serverless functions)
### 5. **DigitalOcean App Platform**

---

## 🚀 Option 1: Deploy to Render.com (RECOMMENDED)

### Why Render?
- ✅ Free tier available (with limitations)
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable management
- ✅ Good for Node.js/Express apps
- ✅ Includes MongoDB connections

### Step-by-Step Instructions:

#### 1. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

#### 2. Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your **BuzzYatra** repository
4. Click **"Connect"** next to your repo

#### 3. Configure Service

**Basic Settings:**
```
Name: buzzyatra-backend
Region: Choose closest to your users (e.g., Singapore for India)
Branch: main (or your default branch)
```

**Build & Deploy Settings:**
```
Root Directory: Backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Free (or paid if you want better performance)
```

#### 4. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each of these (from your `Backend/.env` file):

```env
MONGO_URI=mongodb+srv://suhasj:Yakbekithurgit@routename.enwbahs.mongodb.net/
ORS_API_KEY=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZjMDIzNWExYjgwMjQyNTA4NmU0NzFiYWJmOWRhOGVkIiwiaCI6Im11cm11cjY0In0=
TWILIO_ACCOUNT_SID=ACa6ccf8f2908fd4cf20cac4c584feb39a
TWILIO_AUTH_TOKEN=43e4f3adbd8ba8800839d4a1407a78fb
TWILIO_PHONE_NUMBER=+18134911851
PORT=4000
NODE_ENV=production
```

**Important:** Leave `FRONTEND_URL` and `LANDING_URL` empty for now - you'll add them after deploying Frontend & Landing.

#### 5. Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes first time)
3. Watch the logs for any errors

#### 6. Get Your Backend URL
After successful deployment:
- Your backend will be at: `https://buzzyatra-backend.onrender.com`
- **SAVE THIS URL** - you'll need it for Frontend deployment

#### 7. Test Backend
Visit: `https://buzzyatra-backend.onrender.com`

You should see: **"Welcome to the BuzzYatra Backend"**

---

## 🚀 Option 2: Deploy to Railway.app

### Why Railway?
- ✅ Very easy to use
- ✅ Auto-deploys from GitHub
- ✅ Free trial with $5 credit
- ✅ Good performance

### Step-by-Step Instructions:

#### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

#### 2. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your **BuzzYatra** repository

#### 3. Configure Service
Railway will auto-detect Node.js. Configure:

```
Root Directory: Backend
Start Command: npm start
```

#### 4. Add Environment Variables
1. Click on your service
2. Go to **"Variables"** tab
3. Click **"Raw Editor"**
4. Paste all your environment variables:

```env
MONGO_URI=mongodb+srv://suhasj:Yakbekithurgit@routename.enwbahs.mongodb.net/
ORS_API_KEY=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZjMDIzNWExYjgwMjQyNTA4NmU0NzFiYWJmOWRhOGVkIiwiaCI6Im11cm11cjY0In0=
TWILIO_ACCOUNT_SID=ACa6ccf8f2908fd4cf20cac4c584feb39a
TWILIO_AUTH_TOKEN=43e4f3adbd8ba8800839d4a1407a78fb
TWILIO_PHONE_NUMBER=+18134911851
PORT=4000
NODE_ENV=production
```

#### 5. Generate Domain
1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://buzzyatra-backend.up.railway.app`

#### 6. Deploy
Railway auto-deploys. Check **"Deployments"** tab for status.

---

## 🚀 Option 3: Deploy to Vercel (Serverless)

**Note:** Vercel is primarily for frontend, but supports serverless functions. This requires converting your Express app to serverless functions.

### Not Recommended Because:
- ❌ Requires code changes
- ❌ Serverless has timeout limits
- ❌ More complex setup
- ✅ Use Render or Railway instead

---

## 🔄 Complete Deployment Order

```
Step 1: Deploy Backend (Render/Railway)
        ↓
        Get Backend URL: https://buzzyatra-backend.onrender.com
        ↓
Step 2: Deploy Frontend (Netlify)
        - Use Backend URL in VITE_API_BASE_URL
        ↓
        Get Frontend URL: https://buzzyatra-app.netlify.app
        ↓
Step 3: Deploy Landing (Netlify)
        - Use Frontend URL in VITE_FRONTEND_URL
        ↓
        Get Landing URL: https://buzzyatra-landing.netlify.app
        ↓
Step 4: Update Backend CORS (Render/Railway)
        - Add FRONTEND_URL
        - Add LANDING_URL
        - Redeploy
```

---

## 📋 Backend Environment Variables (Complete List)

After deploying Frontend & Landing, your Backend should have:

```env
# Database & APIs
MONGO_URI=mongodb+srv://...
ORS_API_KEY=...

# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Server Config
PORT=4000
NODE_ENV=production

# CORS (Add these AFTER deploying Frontend & Landing)
FRONTEND_URL=https://buzzyatra-app.netlify.app
LANDING_URL=https://buzzyatra-landing.netlify.app
```

---

## ✅ Testing Backend After Deployment

### 1. Test Root Endpoint
```bash
curl https://buzzyatra-backend.onrender.com
```
Should return: "Welcome to the BuzzYatra Backend"

### 2. Test Stations Endpoint
```bash
curl https://buzzyatra-backend.onrender.com/api/getStation
```
Should return: Array of stations

### 3. Test in Browser
1. Open: `https://buzzyatra-backend.onrender.com`
2. Should see welcome message
3. No errors in browser console

---

## 🐛 Common Backend Deployment Issues

### Issue: "Application failed to respond"
**Solution:**
- Check `PORT` environment variable is set to `4000`
- Verify Start Command is `npm start`
- Check logs for errors

### Issue: "Module not found"
**Solution:**
- Ensure Build Command is `npm install`
- Check all dependencies are in `package.json`
- Review deployment logs

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Test connection string locally first

### Issue: "CORS error" from Frontend
**Solution:**
- Add `FRONTEND_URL` and `LANDING_URL` to Backend env vars
- Ensure URLs match exactly (no trailing slashes)
- Redeploy Backend after adding variables

---

## 💰 Cost Considerations

### Render.com Free Tier
- ✅ 750 hours/month free
- ❌ Spins down after 15 minutes of inactivity
- ❌ Takes ~30 seconds to wake up on first request
- ✅ Perfect for testing/development

### Railway.app
- ✅ $5 free credit initially
- 💰 Pay as you go after credit runs out
- ✅ No spin-down delays
- ✅ Good for production

### Recommendation:
- **Start with Render Free** for testing
- **Upgrade to Railway** or **Render Paid** for production

---

## 🔒 Security Checklist

- [ ] MongoDB connection uses strong password
- [ ] Twilio credentials kept secret
- [ ] Environment variables set (not hardcoded)
- [ ] `.env` file NOT committed to git
- [ ] CORS configured for specific domains (not `*`)
- [ ] MongoDB Atlas whitelist configured

---

## 📱 Monitoring Your Backend

### Render Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history

### Railway Dashboard
- View metrics and logs
- Check deployments
- Monitor usage and costs

### Important Logs to Watch
- Application startup logs
- MongoDB connection status
- API request logs
- Error messages

---

## 🎯 Summary

**Deploy Backend to:** Render.com or Railway.app (NOT Netlify)

**Netlify is for:**
- ✅ Landing Page
- ✅ Frontend App

**Render/Railway is for:**
- ✅ Backend API Server

---

## 📞 Next Steps

1. ✅ Deploy Backend (Render/Railway) - **You're learning this now**
2. → Get Backend URL
3. → Deploy Frontend (Netlify) with Backend URL
4. → Deploy Landing (Netlify) with Frontend URL
5. → Update Backend CORS with Frontend & Landing URLs

**See [NETLIFY_GUIDE.md](./NETLIFY_GUIDE.md) for Frontend & Landing deployment**

---

**Ready to deploy your Backend! 🚀**
