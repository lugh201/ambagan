import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import groupRoutes from './routes/groups.js'
import inviteRoutes from './routes/invites.js'

const app = express()
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({ origin: frontendUrl }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/invites', inviteRoutes)

const port = process.env.PORT || 5174
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
