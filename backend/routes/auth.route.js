import { Router } from 'express'
import { query } from '../db/db.js'
import bcrypt from 'bcrypt'
import authMiddleware from '../tools/authMiddleWare.js'
import jwt from 'jsonwebtoken'
const router = Router()

router.post('/register', async (req, res) => {
  const { email, name, password, role } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const result = await query(
      'INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, name, hashedPassword, role]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Возвращаем токен и данные пользователя
    res.json({
      message: 'Login successful',
      token,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [req.user.id]
    )
    const user = result.rows[0]
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    console.error('Error fetching user data:', err)
    res.status(500).json({ error: 'Failed to fetch user data' })
  }
})

export default router
