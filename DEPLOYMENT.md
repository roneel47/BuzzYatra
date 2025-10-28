# BuzzYatra Deployment Guide

## 🏗️ Project Architecture

```
Landing Page (Netlify) → Frontend App (Netlify) → Backend API (Render/Railway)
     Port 8080              Port 5173                Port 4000
```

## 📦 Project Structure

1. **Landing** - Landing page with hero, features, and CTA
2. **Frontend** - Main React application with SOS features
3. **Backend** - Express.js API server with MongoDB

---

## 🚀 Deployment Steps

### 1️⃣ Deploy Backend (Render or Railway)

#### Option A: Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `buzzyatra-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
5. Add Environment Variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   ORS_API_KEY=your_openrouteservice_api_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   NODE_ENV=production
   PORT=4000
   ```

6. Click "Create Web Service"
7. **Note the deployed URL** (e.g., `https://buzzyatra-backend.onrender.com`)

#### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `Backend`
   - **Start Command**: `npm start`
5. Add all environment variables (same as above)
6. **Note the deployed URL**

---

### 2️⃣ Deploy Frontend (Netlify)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
   
5. Add Environment Variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url.onrender.com/api` (from step 1)

6. Click "Deploy site"
7. **Note the deployed URL** (e.g., `https://buzzyatra-app.netlify.app`)

---

### 3️⃣ Deploy Landing Page (Netlify)

1. On Netlify, click "Add new site" → "Import an existing project"
2. Connect your GitHub repository again
3. Configure:
   - **Base directory**: `Landing`
   - **Build command**: `npm run build`
   - **Publish directory**: `Landing/dist`
   
4. Add Environment Variables:
   - Key: `VITE_FRONTEND_URL`
   - Value: `https://buzzyatra-app.netlify.app` (from step 2)

5. Click "Deploy site"
6. **Note the deployed URL** (e.g., `https://buzzyatra.netlify.app`)

---

### 4️⃣ Update Backend CORS

After deploying Frontend and Landing, update your Backend environment variables:

On Render/Railway, add:
```
FRONTEND_URL=https://buzzyatra-app.netlify.app
LANDING_URL=https://buzzyatra.netlify.app
```

Then redeploy the backend.

---

## 🔄 Update Flow After Deployment

Whenever you make changes:

1. **Push to GitHub** - All deployments are connected to your repo
2. **Auto Deploy**:
   - Netlify will automatically rebuild Frontend & Landing
   - Render/Railway will automatically rebuild Backend

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
MONGO_URI=mongodb+srv://...
ORS_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://buzzyatra-app.netlify.app
LANDING_URL=https://buzzyatra.netlify.app
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://buzzyatra-backend.onrender.com/api
```

### Landing (.env)
```env
VITE_FRONTEND_URL=https://buzzyatra-app.netlify.app
```

---

## ✅ Testing After Deployment

1. Visit Landing page → Click "Get Started" → Should redirect to Frontend
2. On Frontend → Configure emergency contacts → Should save to backend
3. Test SOS button → Should send SMS via Twilio

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure Backend `FRONTEND_URL` and `LANDING_URL` match your Netlify URLs
- Check Backend CORS configuration in `server.js`

### API Not Working
- Verify `VITE_API_BASE_URL` in Frontend environment variables
- Check Backend is running on Render/Railway
- Check Backend logs for errors

### Build Failures
- Ensure all dependencies are in `package.json`
- Check Node version compatibility (use Node 18)
- Review build logs on Netlify/Render

---

## 📱 Custom Domains (Optional)

### Landing Page
1. In Netlify → Site settings → Domain management
2. Add custom domain (e.g., `buzzyatra.com`)
3. Update DNS records as shown

### Frontend
1. In Netlify → Site settings → Domain management
2. Add custom domain (e.g., `app.buzzyatra.com`)
3. Update `VITE_FRONTEND_URL` in Landing env vars

### Backend
1. In Render → Settings → Custom domains
2. Add custom domain (e.g., `api.buzzyatra.com`)
3. Update `VITE_API_BASE_URL` in Frontend env vars

---

## 🎯 Quick Commands Reference

### Local Development
```bash
npm run dev                # Run all three projects locally
npm run build:all          # Build all projects
npm start                  # Run production builds locally
```

### Individual Projects
```bash
npm run dev:frontend       # Run only frontend
npm run dev:backend        # Run only backend
npm run dev:landing        # Run only landing
```

---

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Ready to Deploy! 🚀**
