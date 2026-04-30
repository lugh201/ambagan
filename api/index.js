import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pkg from '@vercel/express';
const { handle } = pkg;
import authRoutes from '../server/routes/auth.js'
import groupRoutes from '../server/routes/groups.js'
import inviteRoutes from '../server/routes/invites.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/invites', inviteRoutes)

// TEMP: Environment variable test endpoint
app.get('/api/env-test', (req, res) => {
  res.json({
    databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set',
    jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
    nodeEnv: process.env.NODE_ENV,
  })
})

// Vercel serverless handler
export default handle(app)