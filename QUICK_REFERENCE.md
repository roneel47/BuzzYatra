# 🎯 BuzzYatra - Quick Reference

## 🚀 Local Development

```bash
# Start all projects
npm run dev

# Build all projects
npm run build:all

# Install all dependencies
npm run install:all
```

## 📦 Project URLs (Local)

- Landing: http://localhost:8080
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 🌐 Deployment Platforms

| Component | Platform | Build Command | Publish Dir |
|-----------|----------|---------------|-------------|
| Backend | Render/Railway | `npm install` | N/A |
| Frontend | Netlify | `npm run build` | `Frontend/dist` |
| Landing | Netlify | `npm run build` | `Landing/dist` |

## 🔑 Environment Variables

### Backend (Render/Railway)
```env
MONGO_URI=mongodb+srv://...
ORS_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.netlify.app
LANDING_URL=https://your-landing.netlify.app
```

### Frontend (Netlify)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Landing (Netlify)
```env
VITE_FRONTEND_URL=https://your-frontend.netlify.app
```

## 🔄 Deployment Order

1. **Backend** → Get URL
2. **Frontend** → Use Backend URL, Get Frontend URL
3. **Landing** → Use Frontend URL
4. **Update Backend** → Add Frontend & Landing URLs for CORS

## 📚 Documentation Files

- `DEPLOYMENT.md` - Complete deployment guide
- `DEVELOPER.md` - Developer setup guide
- `DEPLOY_CHECKLIST.md` - Step-by-step deployment checklist
- `README.md` - Project overview
- `.env.production.example` - Production env template

## 🐛 Quick Fixes

**CORS Error:**
```env
# Add to Backend .env
FRONTEND_URL=https://exact-frontend-url.netlify.app
LANDING_URL=https://exact-landing-url.netlify.app
```

**Build Fails:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API 404:**
```env
# Ensure Frontend .env has /api
VITE_API_BASE_URL=https://backend.onrender.com/api
```

## ✅ Testing After Deployment

1. Landing → Click "Get Started" → Should go to Frontend
2. Frontend → Add contact → Check network tab for API call
3. Frontend → SOS button → Should send SMS
4. Check all consoles for errors

---

**For detailed instructions, see [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)**
