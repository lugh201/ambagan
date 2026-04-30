import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

export const signToken = (user) => {
  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' })
}

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing token' })
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    req.user = { id: payload.userId }
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
