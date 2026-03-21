# CafeeManager

CafeeManager is a full-stack app for managing кафе/ресторан: меню, столики, заказы, рестораны и подписки.

## Features
- User authentication (JWT)
- Restaurant management
- Menu categories and items
- Tables with QR codes
- Orders flow
- Subscription limits (Free/Pro/Business)
- Stripe checkout + webhook

## Tech Stack
### Backend
- Node.js + Express
- PostgreSQL
- JWT, bcrypt
- Stripe

### Frontend
- React + Vite

## Getting Started
### Prerequisites
- Node.js (LTS)
- PostgreSQL

### Backend Setup
1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables (`backend/.env`):
```
DATABASE_URL=postgres://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:5173
PORT=8080
```

3. Create tables. Use the schema in `backend/Tables.md`.

4. Run backend:
```bash
npm run dev
```
Server starts on `http://localhost:8080` (or `PORT`).

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run frontend:
```bash
npm run dev
```

## API Docs
- Routes: `backend/ROUTES.md`
- DB schema and queries: `backend/Tables.md`

## Project Structure
```
.
├── backend/
│   ├── db/
│   ├── routes/
│   ├── tools/
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    └── package.json
```
