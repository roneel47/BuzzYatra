# 🚀 Deploy Backend to Render - Step-by-Step Tutorial

## 📋 Prerequisites
- ✅ GitHub account
- ✅ Your BuzzYatra code pushed to GitHub
- ✅ MongoDB Atlas account (or connection string)
- ✅ Twilio account credentials

---

## 🎯 Step-by-Step Deployment

### Step 1: Create Render Account (5 minutes)

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account**
4. Click **"Authorize Render"** to connect GitHub

---

### Step 2: Create New Web Service (2 minutes)

1. On Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed
4. Find your **BuzzYatra** repository in the list
5. Click **"Connect"** next to it

---

### Step 3: Configure Your Service (10 minutes)

Fill in these settings:

#### **Basic Information:**
```
Name: buzzyatra-backend
(or any name you prefer - this will be in your URL)

Region: Singapore
(closest to India for better performance)

Branch: prod
(or main/master - whatever your default branch is)

Root Directory: Backend
⚠️ IMPORTANT: Type exactly "Backend" - this tells Render to look in the Backend folder
```

#### **Build & Deploy Settings:**
```
Runtime: Node

Build Command: npm install
(This installs all dependencies from package.json)

Start Command: npm start
(This runs: node server.js)
```

#### **Instance Type:**
```
Free
(or Standard if you want better performance - $7/month)
```

---

### Step 4: Add Environment Variables (5 minutes)

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** for each of these:

```env
Key: MONGO_URI
Value: mongodb+srv://suhasj:Yakbekithurgit@routename.enwbahs.mongodb.net/

Key: ORS_API_KEY
Value: eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZjMDIzNWExYjgwMjQyNTA4NmU0NzFiYWJmOWRhOGVkIiwiaCI6Im11cm11cjY0In0=

Key: TWILIO_ACCOUNT_SID
Value: ACa6ccf8f2908fd4cf20cac4c584feb39a

Key: TWILIO_AUTH_TOKEN
Value: 43e4f3adbd8ba8800839d4a1407a78fb

Key: TWILIO_PHONE_NUMBER
Value: +18134911851

Key: PORT
Value: 4000

Key: NODE_ENV
Value: production

Key: FRONTEND_URL
Value: https://buzzyatra-frontend.netlify.app

Key: LANDING_URL
Value: https://buzzyatra-landing.netlify.app
```

**💡 Tip:** Click **"Add from .env"** button and paste all variables at once:
```
MONGO_URI=mongodb+srv://suhasj:Yakbekithurgit@routename.enwbahs.mongodb.net/
ORS_API_KEY=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZjMDIzNWExYjgwMjQyNTA4NmU0NzFiYWJmOWRhOGVkIiwiaCI6Im11cm11cjY0In0=
TWILIO_ACCOUNT_SID=ACa6ccf8f2908fd4cf20cac4c584feb39a
TWILIO_AUTH_TOKEN=43e4f3adbd8ba8800839d4a1407a78fb
TWILIO_PHONE_NUMBER=+18134911851
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://buzzyatra-frontend.netlify.app
LANDING_URL=https://buzzyatra-landing.netlify.app
```

---

### Step 5: Deploy! (10-15 minutes)

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Wait for deployment (this takes 10-15 minutes first time)

**You'll see:**
```
==> Cloning from https://github.com/roneel47/BuzzYatra...
==> Checking out commit...
==> Downloading cache...
==> Installing dependencies...
==> Building...
==> Starting service...
==> Your service is live 🎉
```

---

### Step 6: Get Your Backend URL (1 minute)

After deployment succeeds:

1. You'll see your service URL at the top:
   ```
   https://buzzyatra-backend.onrender.com
   ```
   (The exact name depends on what you named your service)

2. **Copy this URL!** You'll need it for Frontend.

---

### Step 7: Test Your Backend (2 minutes)

1. **Click on the URL** or visit in browser:
   ```
   https://buzzyatra-backend.onrender.com
   ```

2. You should see:
   ```
   Welcome to the BuzzYatra Backend
   ```

3. Test an API endpoint:
   ```
   https://buzzyatra-backend.onrender.com/api/getStation
   ```
   Should return: Array of stations (JSON)

---

## ✅ Verification Checklist

After deployment, check:

- [ ] Service shows **"Live"** status (green dot)
- [ ] Visiting base URL shows welcome message
- [ ] Logs show: `Server running on port 4000`
- [ ] Logs show: `MongoDB connected`
- [ ] No error messages in logs

---

## 🔍 Where to Find Things in Render Dashboard

### **View Logs:**
1. Go to your service dashboard
2. Click **"Logs"** tab
3. See real-time logs (useful for debugging)

### **View/Edit Environment Variables:**
1. Click **"Environment"** tab
2. Can add/edit/delete variables
3. Click **"Save Changes"** to redeploy

### **Manual Deploy:**
1. Click **"Manual Deploy"** button
2. Select branch
3. Click **"Deploy"**

### **Settings:**
1. Click **"Settings"** tab
2. Can change:
   - Instance type
   - Build command
   - Start command
   - Auto-deploy settings

---

## 🚨 Important Notes

### **Free Tier Limitations:**
- ⚠️ **Spins down after 15 minutes** of inactivity
- ⚠️ Takes **30-60 seconds** to wake up on first request
- ✅ **750 hours/month free** (more than enough)
- ✅ Perfect for development/testing

### **To Avoid Spin-Down:**
- Upgrade to **Starter plan** ($7/month)
- Or use a service like **UptimeRobot** to ping your backend every 10 minutes

---

## 📝 Commands Reference

### **Build Command:**
```bash
npm install
```
What it does: Installs all packages from `Backend/package.json`

### **Start Command:**
```bash
npm start
```
What it does: Runs `node server.js` from `Backend/package.json`

### **Why these work:**
Your `Backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## 🔄 Auto-Deploy Setup

Render automatically deploys when you push to GitHub!

**To disable auto-deploy:**
1. Go to Settings tab
2. Under "Build & Deploy"
3. Toggle "Auto-Deploy" to OFF

**To manually deploy:**
1. Click "Manual Deploy" button
2. Choose branch
3. Click "Deploy"

---

## 🎯 Next Steps After Backend is Deployed

### 1. Update Frontend Environment Variable

Go to Netlify (Frontend site):
1. Site settings → Environment variables
2. Add/Update:
   ```
   VITE_API_BASE_URL=https://buzzyatra-backend.onrender.com/api
   ```
   (Use your actual backend URL + `/api`)
3. Save
4. Trigger deploy: Deploys → Trigger deploy → Deploy site

### 2. Test Complete Flow

1. Visit Landing: https://buzzyatra-landing.netlify.app
2. Click "Get Started"
3. Should go to: https://buzzyatra-frontend.netlify.app
4. Open browser console (F12)
5. Try adding emergency contact
6. Should make API call to: `https://buzzyatra-backend.onrender.com/api/...`
7. Check for CORS errors (should be none if FRONTEND_URL is set correctly)

---

## 🐛 Troubleshooting

### **Issue: Build Failed**

**Check:**
1. Logs tab for error message
2. Root Directory is set to `Backend`
3. Build Command is `npm install`

**Common fixes:**
- Check `package.json` exists in Backend folder
- Ensure all dependencies are listed in `package.json`
- Check Node version compatibility

---

### **Issue: Application Failed to Respond**

**Check:**
1. Start Command is `npm start`
2. PORT environment variable is set to `4000`
3. Logs show "Server running on port 4000"

**Fix:**
- Verify `server.js` uses `process.env.PORT`
- Check logs for JavaScript errors

---

### **Issue: MongoDB Connection Failed**

**Check Logs for:**
```
MongoDB error: MongooseServerSelectionError
```

**Fix:**
1. Check `MONGO_URI` is correct
2. Go to MongoDB Atlas
3. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
4. Check username/password in connection string

---

### **Issue: CORS Error from Frontend**

**In browser console:**
```
Access to fetch has been blocked by CORS policy
```

**Fix:**
1. Check Backend environment variables:
   - `FRONTEND_URL=https://buzzyatra-frontend.netlify.app`
   - `LANDING_URL=https://buzzyatra-landing.netlify.app`
2. Make sure URLs match EXACTLY (no trailing slashes)
3. Redeploy backend after adding variables

---

### **Issue: Slow Response (Free Tier)**

**If first request takes 30+ seconds:**
- This is normal for free tier (spin-down)
- Service wakes up after first request
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid plan ($7/month)
- Use UptimeRobot to keep service awake
- Accept the delay for free hosting

---

## 💰 Pricing

### **Free Tier:**
- **Cost:** $0/month
- **Hours:** 750 hours/month
- **RAM:** 512 MB
- **Spin-down:** After 15 minutes inactivity
- **Perfect for:** Development, testing, low-traffic apps

### **Starter Plan:**
- **Cost:** $7/month
- **RAM:** 512 MB
- **No spin-down:** Always running
- **Better for:** Production apps

---

## 📊 Render Dashboard Overview

```
┌─────────────────────────────────────────┐
│ buzzyatra-backend        🟢 Live       │
│ https://buzzyatra-backend.onrender.com │
├─────────────────────────────────────────┤
│ 📊 Logs       | Real-time logs         │
│ ⚙️  Environment | Env variables         │
│ 🔧 Settings    | Service config        │
│ 📈 Metrics     | CPU, Memory usage     │
│ 🔄 Deploys     | Deployment history    │
└─────────────────────────────────────────┘
```

---

## ✅ Final Checklist

After deploying to Render:

- [ ] Service status shows "Live" (green)
- [ ] Base URL returns welcome message
- [ ] `/api/getStation` returns data
- [ ] Logs show "MongoDB connected"
- [ ] Logs show "Server running on port 4000"
- [ ] No errors in logs
- [ ] Backend URL copied for Frontend
- [ ] Frontend updated with backend URL
- [ ] CORS working (no errors in browser)
- [ ] SOS SMS sending works

---

## 🎉 You're Done!

Your backend is now live at:
```
https://buzzyatra-backend.onrender.com
```

**Complete architecture:**
```
Landing (Netlify)
  ↓
Frontend (Netlify)
  ↓
Backend (Render) ← You are here! ✅
  ↓
MongoDB Atlas
```

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Check Logs:** Render Dashboard → Logs tab
- **Community:** Render Community Forum

**Happy Deploying! 🚀**
