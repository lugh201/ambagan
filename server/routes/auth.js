import express from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { signToken } from '../lib/auth.js'

const router = express.Router()

const normalizeEmail = (email) => email?.trim().toLowerCase()
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

router.post('/register', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const name = req.body.name?.trim() || null
  const password = req.body.password

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10)
    user = await prisma.user.create({
      data: {
        email,
        name,
        isVerified: true,
        password: passwordHash,
      },
    })
  }

  return res.json({ ok: true, message: 'Registered successfully' })
})

router.get('/verify', async (req, res) => {
  const token = req.query.token

  if (!token) {
    return res.status(400).json({ message: 'Missing token' })
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: String(token) },
  })

  if (!record) {
    return res.status(404).json({ message: 'Token not found' })
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } })
    return res.status(410).json({ message: 'Token expired' })
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { isVerified: true },
  })

  await prisma.verificationToken.delete({ where: { id: record.id } })

  return res.json({ ok: true })
})

router.post('/login', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const password = req.body.password

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({ message: 'Account not found' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken(user)

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
})

export default router
