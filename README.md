# Ambagan App

A simple group expense sharing app for Filipino barkadas, families, and teams. Built with React, Axios, and Recharts.

## Features

- Email registration with verification
- JWT-based login
- Create and join ambagan groups via invite code
- Track expenses and auto-split equally
- Balance summary with Taglish labels
- Pie chart of total contributions per member
- Mobile-first, clean layout

## Tech Stack

- React (functional components + hooks)
- React Router
- Axios for API calls
- Recharts for visualizations
- Express API with Prisma + PostgreSQL (Supabase)
- Resend for verification emails
- Vanilla CSS

## Getting Started

1. Install dependencies.

```bash
npm install
```

2. Create env files.

- Copy .env.example to .env
- Fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, RESEND_API_KEY, RESEND_FROM, FRONTEND_URL
- Make sure VITE_API_URL includes /api (example: http://localhost:5174/api)

3. Set up Prisma and migrate.

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Run the app.

```bash
npm run dev
```

This runs both the Vite client and the local API server.

## API

The API runs on http://localhost:5174 and is proxied at /api from Vite.

Available endpoints:

- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/verify?token=...
- GET /api/groups
- GET /api/groups/:groupId
- POST /api/groups
- POST /api/groups/join
- GET /api/groups/:groupId/expenses
- POST /api/groups/:groupId/expenses

## Notes

- API calls use Axios with a local Express server.
- JWT is sent via the Authorization header.
