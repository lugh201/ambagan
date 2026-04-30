Upgrade an existing "Ambagan App" (group expense sharing system for Filipinos) into a full production-ready application.

Current stack:

* React (Vite)
* Express backend
* Axios
* Recharts
* JSON file storage

Goal:
Transform this into a cloud-based, mobile-friendly app with authentication, email verification, PostgreSQL database, and deployment-ready setup.

---

1. DATABASE (Supabase + Prisma)

* Replace JSON storage with PostgreSQL using Supabase
* Use Prisma ORM

Models:

User:

* id (UUID)
* email (unique)
* name (optional)
* isVerified (boolean, default false)
* createdAt

VerificationToken:

* id
* token (unique)
* userId
* expiresAt

Group:

* id
* name
* createdByUserId

GroupMember:

* id
* groupId
* userId

Expense:

* id
* groupId
* paidByUserId
* amount (decimal)
* description
* createdAt

ExpenseSplit:

* id
* expenseId
* userId
* shareAmount

---

2. AUTHENTICATION + EMAIL VERIFICATION

* Users must register with email

* On register:

  * Save user with isVerified = false
  * Generate verification token
  * Store token in database with expiration
  * Send email with verification link:
    https://your-frontend-url/verify?token=XYZ

* Verification endpoint:
  GET /auth/verify?token=XYZ

  * Validate token
  * Set user.isVerified = true
  * Delete token

* Login:

  * Only allow if isVerified = true
  * Return JWT token

* Use JWT for authentication

* Protect all group and expense routes

---

3. BACKEND (Express)

Create endpoints:

Auth:

* POST /auth/register
* POST /auth/login
* GET /auth/verify

Groups:

* GET /groups
* POST /groups
* POST /groups/join

Expenses:

* GET /groups/:groupId/expenses

* POST /groups/:groupId/expenses

* Use middleware to validate JWT

* Use async/await

* Use environment variables:

  * DATABASE_URL
  * JWT_SECRET
  * RESEND_API_KEY

---

4. EMAIL SENDING

* Use Resend
* Send verification email with link
* Keep email simple:
  "Click to verify your Ambagan account"

---

5. FRONTEND (React + Vite)

* Use React functional components
* Use hooks (useState, useEffect)
* Use Axios for API calls
* Use React Router

Pages:

* /register
* /login
* /verify
* /groups
* /groups/:id

Features:

* Register user
* Login user
* Handle email verification page
* Store JWT in localStorage
* Attach token in Axios headers
* Protect routes (redirect if not logged in)

---

6. GROUP + EXPENSE FEATURES

* Create ambagan group

* Join via invite link/code

* Add expense:

  * amount
  * paidBy
  * description
  * split equally

* Compute balances:

  * show "who owes who"

---

7. PIE CHART (Recharts)

* Add ContributionPieChart component

* Show total contribution per user

* Format data like:
  [{ name: "Louie", value: 1500 }]

* Display:

  * User name
  * Peso amount (₱)

---

8. MOBILE-FRIENDLY UI

* Mobile-first layout

* Max width 480px

* Centered container

* Large buttons and inputs

* Simple card layout

* Use Taglish labels:

  * "May utang ka: ₱500"
  * "Bayad ka na ba?"

---

9. ENVIRONMENT VARIABLES

Frontend (.env):

* VITE_API_URL

Backend (.env):

NEXT_PUBLIC_SUPABASE_URL=https://kytfoxpojglgwatpvbrd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RqOSLbh7HjgMRU0I_4spvg_Jt5SicBp
database_url = postgresql://postgres:/DMy#,3zRX2qkYG@db.kytfoxpojglgwatpvbrd.supabase.co:5432/postgres
* JWT_SECRET=c8f3e9b1a7d44f0c9e2b6a5d1f7c8e3a9b4d6f2c1a8e7d5b3c9f0a6e2d1c7b4
* Resend_API_KEY - re_ezbEbddK_9LmPZRMP32uqopmaAFShzyi5

---

10. DEPLOYMENT

Frontend:

* Deploy to Vercel
* Build command: npm run build
* Output: dist

Backend:

* Deploy to Render
* Start command: node server.js

Database:

* Use Supabase hosted PostgreSQL

---

11. CODE QUALITY


* Separate API logic from UI

* Keep code clean and readable

* Use async/await everywhere

---

Goal:
Build a simple, scalable, mobile-friendly Ambagan app where Filipino users can track shared expenses, verify accounts via email, and view balances clearly, with a pie chart visualization and full cloud deployment.
