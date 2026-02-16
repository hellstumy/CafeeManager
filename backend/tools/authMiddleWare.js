import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET не задан в .env файле!')
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Теперь в req.user доступен { id, email, ... }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
