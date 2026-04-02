<h1 align="center">🚀 CHUGLI - Real-Time Chat Application 🚀</h1>

<p align="center">
  <strong>A modern, full-stack real-time messaging platform built with React, Node.js, and MongoDB</strong>
</p>

![Demo App](/frontend/public/screenshot-for-readme.png)

## ✨ Key Features

- 🔐 **Custom JWT Authentication** - Secure user management without 3rd-party auth
- ⚡ **Real-time Messaging** - Instant message delivery via Socket.io
- 🟢 **Online/Offline Status** - Live presence indicators for all users
- 🔔 **Notification Sounds** - Optional audio feedback for messages and typing
- 📨 **Email Integration** - Welcome emails on signup via Resend
- 🗂️ **Image Uploads** - Profile pictures stored on Cloudinary
- 🧰 **REST API** - Fully documented Node.js & Express backend
- 🧱 **MongoDB** - Cloud database with MongoDB Atlas
- 🚦 **Rate Limiting** - API protection with Arcjet security
- 🎨 **Neo-Brutalist UI** - Beautiful design with React, Tailwind CSS
- 🧠 **State Management** - Zustand for clean global state
- 🚀 **Cloud Ready** - Deployment guides for Railway & Vercel

---

## 📋 Tech Stack

**Frontend:**
- React 19 | Vite | React Router | Socket.io Client
- Tailwind CSS | Zustand | Axios

**Backend:**
- Node.js | Express | Mongoose | Socket.io
- JWT | bcryptjs | Cloudinary | Resend | Arcjet

**Database & Services:**
- MongoDB Atlas | Cloudinary | Resend | Arcjet

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- MongoDB Atlas account
- Cloudinary account
- Resend account (optional for emails)

### Installation & Setup

**Backend Setup:**
```bash
cd chugli/backend
npm install
# Create .env file with your credentials
npm run dev
# Runs on http://localhost:3000
```

**Frontend Setup:**
```bash
cd chugli/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.

---

## 📚 Documentation

- **[Deployment Guide](../DEPLOYMENT.md)** - Deploy to Railway (backend) & Vercel (frontend)
- **[Project Report](../PROJECT_REPORT.md)** - Detailed architecture & implementation guide

---

## 🎯 Features in Detail

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- HTTP-only cookies for token storage
- Auto-login on page reload

### Real-Time Chat
- Send text messages instantly
- Share images via file upload
- See message history with any user
- Typing indicators
- Online/offline status

### User Management
- Search users by name or email
- View all registered users
- Update profile picture
- Contact list management

---

## 📦 Build & Deploy

**Build for Production:**
```bash
npm run build
```

**Deploy:**
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Railway (persistent server for Socket.io)

See [DEPLOYMENT.md](../DEPLOYMENT.md) for step-by-step instructions.

---

## 🎓 Course Project

Built for **SEIT3241 - Full Stack Development** (Semester 6)

**Developer:** @jayyvarmaa  
**Date:** April 2026  
**Status:** ✅ Complete & Production-Ready

---

## 📄 License

ISC
