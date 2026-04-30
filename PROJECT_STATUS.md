# Ambagan App - Project Status

## Purpose
A simple group expense sharing app for Filipino barkadas, families, and teams. The goal is quick expense tracking with equal split and clear balances using Taglish labels and a friendly UI.

## What Was Built
- React single-page app with functional components and hooks.
- Email-only login (no real auth) to scope groups per user.
- Group creation and joining via invite code link.
- Expense entry per group and equal split calculations.
- Balance summary per member and contribution pie chart.
- Mobile-first layout with clean, card-based UI.
- Local Express API with JSON file storage for a persistent demo.

## Frontend Highlights
- App state includes current user, groups, active group, expenses, and loading states.
- Fetches groups by email, then group details and expenses by group id.
- Components for authentication, group list, group details, expense list, balance summary, and charts.
- Axios service layer encapsulates API calls.

## Backend Highlights
- Express server at port 5174 with CORS and JSON parsing.
- File-based data store in server/data.json.
- Endpoints:
  - GET /api/health
  - GET /api/groups?email=you@ambagan.ph
  - GET /api/groups/:groupId
  - POST /api/groups
  - POST /api/groups/join
  - GET /api/groups/:groupId/expenses
  - POST /api/groups/:groupId/expenses

## Tech Stack
- React 19 + Vite
- Axios
- Recharts
- Express + CORS
- Vanilla CSS

## How To Run
1. npm install
2. npm run dev

This runs Vite and the API server together.

## Current Limitations
- No real authentication or user management.
- Data is stored in a local JSON file only.
- No validation beyond required fields.
- Equal split only (no custom shares or settlements).

## Suggested Next Steps
- Replace JSON file storage with a real database.
- Add proper auth (email magic link or OAuth).
- Add settlement suggestions and payment tracking.
- Improve input validation and error feedback.
- Add tests for API and UI logic.
