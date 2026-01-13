# Inventory Management System

A full-stack inventory management system built using **React, Node.js, Express, and PostgreSQL**, designed to replicate real-world inventory and sales workflows.

## Features
- **Auth:** JWT Authentication & Role-based Access (Admin / Staff)
- **Inventory:** Product Management with Soft Delete
- **POS:** Barcode-based Sales (POS-style workflow) with automatic stock deduction
- **Analytics:** Dashboard with KPIs & Charts (Recharts)
- **Data:** CSV Import / Export (Admin) & Secure REST APIs

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Cloud)

## Architecture
- Client–Server architecture
- RESTful APIs with JWT security
- Role-based authorization
- Modular backend & service-based frontend

---

## Environment Variables

**Backend (`server/.env`)**
```env
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```

**Frontend (`client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
---

## Run Locally

**Backend**
```env
cd server
npm install
npm run dev
```
**Frontend**
```env
cd client
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`