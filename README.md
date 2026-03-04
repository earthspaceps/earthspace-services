# Earthspace Services Platform

> **Reliable Home Maintenance Experts at Your Doorstep**

A production-ready, full-stack home maintenance service marketplace built with React + Node.js + PostgreSQL.

---

## 📁 Project Structure

```
ESServices/
├── server/          # Node.js + Express Backend API
├── client/          # React (Vite) Frontend  
│   └── src/apps/
│       ├── customer/    # Customer-facing app
│       ├── technician/  # Technician portal
│       └── admin/       # Admin dashboard
└── database/
    └── schema.sql   # PostgreSQL schema + seed data
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm

### 1. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE earthspace_db;"

# Run schema (creates all tables + seeds service data)
psql -U postgres -d earthspace_db -f database/schema.sql
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy env file and fill in values
copy .env.example .env

# Start dev server (port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install

# Start Vite dev server (port 5173)
npm run dev
```

Open **http://localhost:5173**

---

## 🌐 Application URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173/login` | Login / Register |
| `http://localhost:5173/customer` | Customer App |
| `http://localhost:5173/technician` | Technician Portal |
| `http://localhost:5173/admin` | Admin Dashboard |
| `http://localhost:5000/api/health` | API Health Check |

---

## 👤 Default Admin Login

```
Email:    admin@earthspaceservices.com
Password: Admin@123    ← ⚠️ Change this immediately!
Phone:    +911234567890
```

---

## 🔑 Environment Variables (server/.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret (change in prod) |
| `SMTP_*` | Email config (Gmail SMTP) |
| `TWILIO_*` | SMS & WhatsApp (Twilio) |
| `RAZORPAY_*` | Payment gateway keys |
| `GOOGLE_MAPS_API_KEY` | Maps integration |

---

## 🧩 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Email + password login |
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP |
| GET  | `/api/auth/me` | Get current user |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/categories` | All service categories |
| GET | `/api/services` | List services (filter by category/search) |
| GET | `/api/services/:slug` | Single service |
| POST | `/api/services` | Create service (admin) |
| PUT | `/api/services/:id` | Update/price edit (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET  | `/api/bookings` | List bookings (role-filtered) |
| GET  | `/api/bookings/:id` | Booking detail |
| PATCH | `/api/bookings/:id/status` | Update status (technician) |
| POST | `/api/bookings/:id/cancel` | Cancel booking |
| POST | `/api/bookings/:id/assign` | Manual assign (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Initiate payment |
| POST | `/api/payments/verify` | Verify gateway payment |
| GET  | `/api/payments` | All payments (admin) |
| POST | `/api/payments/ratings` | Submit rating |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | KPIs + monthly stats |
| GET | `/api/admin/bookings/live` | Live booking feed |
| GET | `/api/users?role=customer` | User list |
| PATCH | `/api/users/:id/toggle-status` | Suspend/activate user |
| GET  | `/api/users/technicians` | Technician list |
| PATCH | `/api/users/technicians/:id/verify` | Verify technician |

---

## 🏗️ Architecture

```
React Client ─── Axios + JWT ──► Express API Gateway
                                        │
                 ┌──────────────────────┤
                 │          │           │           │
            Auth Svc   Booking Eng  Payment Svc  Notification Svc
                 │          │           │           │
                 └──────────┴─────────────────────────► PostgreSQL
```

**Security:** JWT auth · RBAC (customer/technician/admin) · bcrypt passwords · Rate limiting · Helmet · CORS

---

## 🌍 Production Deployment

### Docker (Recommended)
```bash
# Build backend image
cd server && docker build -t earthspace-api .

# Build frontend
cd client && npm run build
# Serve dist/ with Nginx
```

### Cloud Hosting
- **Backend**: AWS EC2 / Elastic Beanstalk / Railway / Render
- **Frontend**: Vercel / Netlify / S3+CloudFront
- **Database**: AWS RDS (PostgreSQL) / Supabase
- **Files**: AWS S3

### Required Before Production
1. Change all secrets in `.env` (JWT, SMTP, Razorpay, etc.)
2. Change default admin password
3. Add real Razorpay/Stripe keys
4. Configure Twilio for SMS/WhatsApp
5. Add Firebase for push notifications
6. Set up SSL certificate

---

## 🛠️ Service Categories Seeded

| Category | Subservices |
|----------|-------------|
| AC Services | Repair, Installation, Gas Refill, Maintenance |
| Electrical | Switch repair, Wiring, Fan, Light, MCB, CCTV |
| Plumbing | Leak, Pipe, Drain, Tap, Toilet |
| Appliance Repair | Fridge, Washing Machine, Microwave, RO, Geyser |
| Handyman | Furniture, Drilling, Carpentry |

---

## 📞 Support
WhatsApp: +91-9999-999999  
Email: support@earthspaceservices.com
