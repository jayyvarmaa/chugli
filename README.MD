# CHUGLI - Real-Time Chat App

A simple, fast real-time chat application where you can send messages instantly and see who's online.
Built with a neo-brutalist design aesthetic.

## Live URLs

- **Frontend:** https://chugli.jayyvarmaa.me (Vercel)
- **Backend:** https://chugli-backend.jayyvarmaa.me (Vercel)

## What's Inside?

**Frontend:** React with Vite, Tailwind CSS, Socket.io-client for real-time updates, Zustand for state management, Firebase Auth for authentication  
**Backend:** Node.js & Express, Socket.io for real-time events (chat, typing, voice signaling), MongoDB for storing messages and user data, Cloudinary for image uploads, Resend for emails, Arcjet for security

**Features:**
- Sign up / log in (email & password, Google OAuth, magic links)
- Email verification
- Create and join community servers
- Text and voice channels
- Direct messages with online/offline status
- Real-time typing indicators and read receipts
- Image uploads (messages & profile pictures)
- Password reset
- Optimistic UI for instant message feedback

## How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/jayyvarmaa/chugli.git
cd chugli
```

### 2. Set up environment variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Backend (`backend/.env`)** — required:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret for token generation
- `CLIENT_URL` — `https://chugli.jayyvarmaa.me` (production) or `http://localhost:5173` (dev)
- `RESEND_API_KEY`, `EMAIL_FROM` — email service
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image uploads
- `ARCJET_KEY`, `ARCJET_ENV` — rate limiting / bot protection
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — Firebase Admin (verifies ID tokens)
- `PORT`, `NODE_ENV`, `LOG_MAJOR`, `LOG_MINOR`

**Frontend (`frontend/.env`)** — required:
- `VITE_BACKEND_URL` — `https://chugli-backend.jayyvarmaa.me` (production) or `http://localhost:3000` (dev)
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — Firebase config (from Firebase Console)
- `VITE_LOG_MAJOR`, `VITE_LOG_MINOR`

### 3. Install dependencies

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 4. Start the apps

Backend:
```bash
npm run dev --prefix backend
# http://localhost:3000
```

Frontend:
```bash
npm run dev --prefix frontend
# http://localhost:5173
```

## Deployment

### Frontend (Vercel)

The frontend is a Vite site. Deploy the `frontend/` directory on Vercel:
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Set the environment variables from `frontend/.env.example` in the Vercel project settings.
- `vercel.json` handles SPA routing (rewrites all paths to `index.html`).

### Backend (Vercel)

The backend is an Express + Socket.io app.

**Important:** Socket.io real-time events (chat, typing, voice signaling) require a host that supports persistent WebSocket connections. If deploying the backend on Vercel serverless functions, only the REST API routes (`/api/...`) will work; real-time socket events need a WebSocket-capable host (e.g. Railway, Render, or a VPS).

The `backend/` directory includes:
- `vercel.json` — configures `@vercel/node` routing for the REST API
- `api/index.js` — serverless entry point that exports the Express app

Set all backend environment variables in your hosting provider's dashboard.

### Root scripts

From the repo root:
```bash
npm run build   # installs backend + frontend deps and builds the frontend
npm run start   # starts the backend
```

## Environment Variables Summary

| Variable | Where | Purpose |
|----------|-------|---------|
| `MONGO_URI` | backend | MongoDB connection string |
| `JWT_SECRET` | backend | JWT signing secret |
| `CLIENT_URL` | backend | CORS / cookie origin (`https://chugli.jayyvarmaa.me`) |
| `VITE_BACKEND_URL` | frontend | API base URL (`https://chugli-backend.jayyvarmaa.me`) |
| `RESEND_API_KEY` | backend | Transactional email |
| `CLOUDINARY_*` | backend | Image uploads |
| `ARCJET_KEY` | backend | Rate limiting & bot protection |
| `FIREBASE_*` | backend + frontend | Firebase Auth |

## Feature Flags

Both the backend and frontend log their feature flags to the console on startup so you can confirm everything is enabled:

- Backend: `src/lib/flags.js` — logged by `src/server.js`
- Frontend: `src/lib/flags.js` — logged by `src/main.jsx`

Look for the `CHUGLI BACKEND - FEATURE FLAGS & RUNTIME CONFIG` and `CHUGLI FRONTEND - FEATURE FLAGS & RUNTIME CONFIG` blocks in the console.

## Security

`.env`, `.env.local`, `.env.*.local`, `node_modules`, `dist`, `build`, and `.vercel` are all gitignored. Never commit real credentials.

---

**Built by:** Jayyvarmaa  
**Course:** SEIT3241 - Full Stack Development
