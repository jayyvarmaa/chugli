# CHUGLI - Real-Time Chat App

A simple, fast real-time chat application where you can send messages instantly and see who's online.

## What's Inside?

**Frontend:** React with Vite, Tailwind CSS, Socket.io for real-time updates  
**Backend:** Node.js & Express, MongoDB for storing messages and user data  
**Features:** Sign up, log in, create chats, send messages, upload profile pics, see online status

## How to Use

1. Clone the repo
2. Set up `.env` files in `backend/` and `frontend/` (see `.env.example`)
3. Install dependencies: `npm install` in both folders
4. Start backend: `npm start` in `backend/`
5. Start frontend: `npm run dev` in `frontend/`
6. Open http://localhost:5173 and start chatting

## Deployed At

- Frontend: https://chugli.jayvarma.site (Vercel)
- Backend: https://api.chugli.jayvarma.site (Railway)

## Environment Variables Needed

**Backend:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for token generation
- `CLOUDINARY_*` - Image upload
- `RESEND_API_KEY` - Email sending
- `ARCJET_KEY` - Rate limiting

**Frontend:**
- `VITE_BACKEND_URL` - Backend API URL

---

**Built by:** Jayyvarmaa  
**Course:** SEIT3241 - Full Stack Development  
**Date:** April 2026
