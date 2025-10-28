# 🚀 BuzzYatra - Developer Quick Start Guide

## Project Overview

BuzzYatra is a safety companion application for Bengaluru commuters with three main components:

1. **Landing** - Marketing/landing page (Port 8080)
2. **Frontend** - Main React application with SOS features (Port 5173)
3. **Backend** - Express.js API server (Port 4000)

---

## 🏃 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm package manager
- MongoDB connection (Atlas or local)

### Setup & Run

1. **Clone and Install Dependencies**
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

2. **Configure Environment Variables**

Create `.env` files in each folder (see `.env.example` files):

**Backend/.env:**
```env
MONGO_URI=mongodb+srv://...
ORS_API_KEY=your_key
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
PORT=4000
FRONTEND_URL=http://localhost:5173
LANDING_URL=http://localhost:8080
NODE_ENV=development
```

**Frontend/.env:**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

**Landing/.env:**
```env
VITE_FRONTEND_URL=http://localhost:5173
```

3. **Run Everything**
```bash
# Run all three projects concurrently
npm run dev
```

This will start:
- Landing: http://localhost:8080
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Individual Commands

```bash
npm run dev:frontend     # Run only frontend
npm run dev:backend      # Run only backend  
npm run dev:landing      # Run only landing page
```

---

## 📁 Project Structure

```
BuzzYatra/
├── Backend/              # Express.js API
│   ├── models/          # MongoDB models
│   ├── server.js        # Main server file
│   ├── .env             # Backend config
│   └── netlify.toml     # Not used (Backend goes to Render/Railway)
│
├── Frontend/            # React + Vite App
│   ├── src/
│   │   ├── components/  # SOS components
│   │   └── App.jsx
│   ├── .env             # Frontend config
│   └── netlify.toml     # Netlify deployment config
│
├── Landing/             # Landing page (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/  # Hero, Features, CTA
│   │   └── App.tsx
│   ├── .env             # Landing config
│   └── netlify.toml     # Netlify deployment config
│
├── package.json         # Root package.json with orchestration scripts
├── DEPLOYMENT.md        # Detailed deployment guide
└── .env.production.example  # Production environment template
```

---

## 🌐 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step deployment instructions.

### Quick Deployment Checklist

1. **Backend** → Deploy to Render or Railway
2. **Frontend** → Deploy to Netlify (Base dir: `Frontend`)
3. **Landing** → Deploy to Netlify (Base dir: `Landing`)
4. Update environment variables with production URLs
5. Test all features in production

---

## 🛠️ Available Scripts

### Root Level Commands
```bash
npm run dev              # Run all projects in development mode
npm run start            # Run all projects in production mode
npm run build:all        # Build all projects
npm run install:all      # Install dependencies for all projects

npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only
npm run dev:landing      # Run landing only

npm run build:frontend   # Build frontend
npm run build:backend    # Build backend (no-op for Express)
npm run build:landing    # Build landing
```

---

## 🔄 Application Flow

```
User visits Landing Page (Port 8080)
         ↓
Clicks "Get Started" button
         ↓
Redirected to Frontend App (Port 5173)
         ↓
Frontend makes API calls to Backend (Port 4000)
         ↓
Backend processes requests & returns data
```

---

## 🔑 Environment Variables

### Backend Requirements
- `MONGO_URI` - MongoDB connection string
- `ORS_API_KEY` - OpenRouteService API key
- `TWILIO_ACCOUNT_SID` - Twilio SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `PORT` - Server port (default: 4000)
- `FRONTEND_URL` - Frontend URL for CORS
- `LANDING_URL` - Landing URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend Requirements
- `VITE_API_BASE_URL` - Backend API URL with `/api` path

### Landing Requirements
- `VITE_FRONTEND_URL` - Frontend app URL for "Get Started" button

---

## 📱 Features

- **SOS System** - Emergency alert with SMS via Twilio
- **Emergency Contacts** - Manage contact list (CRUD)
- **Route Planning** - Calculate routes between stations
- **Location Sharing** - GPS-based location tracking
- **Stop Alerts** - Get alerts before destination

---

## 🐛 Troubleshooting

### Port Already in Use (PowerShell)
```powershell
# Find process using port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

### Environment Variables Not Loading
- Ensure `.env` files exist in correct folders
- Restart dev servers after changing `.env`
- Vite requires `VITE_` prefix for environment variables

### CORS Errors
- Check `FRONTEND_URL` and `LANDING_URL` in Backend `.env`
- Ensure Backend `corsOptions` allows your frontend origin
- In production, set exact URLs (not wildcards)

### Build Failures
- Clear `node_modules` and reinstall: `npm run install:all`
- Check Node version: `node --version` (should be 18+)
- Review build logs for specific errors

---

## 📚 Tech Stack

**Frontend:**
- React 19
- Vite 7
- React Router

**Landing:**
- React 18
- TypeScript
- Vite 5
- TailwindCSS
- Shadcn/ui components

**Backend:**
- Node.js
- Express.js 5
- MongoDB with Mongoose
- Twilio SDK
- OpenRouteService API

**Deployment:**
- Netlify (Frontend & Landing)
- Render/Railway (Backend)

---

## 📄 API Endpoints

### Emergency Contacts
- `GET /api/emergency-contacts/:userId` - Get contacts
- `POST /api/emergency-contacts` - Create contact
- `PUT /api/emergency-contacts/:id` - Update contact
- `DELETE /api/emergency-contacts/:id` - Delete contact

### SOS System
- `POST /api/sos` - Send emergency SOS

### Route Planning
- `POST /api/getRoute` - Get route between stations
- `GET /api/getStation` - Get all stations

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review troubleshooting section above
- Open an issue on GitHub

---

**Happy Coding! 🎉**
