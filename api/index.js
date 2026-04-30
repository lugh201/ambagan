import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { handle } from '@vercel/express'
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

// Vercel serverless handler
export default handle(app)