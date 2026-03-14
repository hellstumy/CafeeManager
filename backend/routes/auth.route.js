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
      'SELECT id, email, name, role, plan FROM users WHERE id = $1',
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

router.patch('/me', authMiddleware, async (req, res) => {
  const { name, email } = req.body

  if (!name && !email) {
    return res.status(400).json({ message: 'Name or email is required' })
  }

  try {
    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name), email = COALESCE($2, email)
       WHERE id = $3
       RETURNING id, email, name, role`,
      [name, email, req.user.id]
    )

    const user = result.rows[0]
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    if (err?.code === '23505') {
      return res.status(409).json({ message: 'Email already in use' })
    }
    console.error('Error updating user data:', err)
    res.status(500).json({ error: 'Failed to update user data' })
  }
})
//DASHBOARD
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    // 1. 📋 Всего ресторанов
    const restaurantsResult = await query(
      'SELECT COUNT(*) FROM restaurants WHERE owner_id = $1',
      [userId]
    )

    // 2. 📦 Заказы за сегодня
    const todayOrdersResult = await query(
      `SELECT COUNT(*) 
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE r.owner_id = $1 
       AND DATE(o.created_at) = CURRENT_DATE`,
      [userId]
    )

    // 3. 💰 Выручка за сегодня (исключаем cancelled)
    const todayRevenueResult = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE r.owner_id = $1 
       AND DATE(o.created_at) = CURRENT_DATE
       AND o.status != 'cancelled'`,
      [userId]
    )

    // 4. ⏳ Активные заказы (pending + preparing)
    const activeOrdersResult = await query(
      `SELECT COUNT(*) 
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE r.owner_id = $1 
       AND o.status IN ('pending', 'inprogress')`,
      [userId]
    )

    // Парсим результаты
    const stats = {
      restaurants: parseInt(restaurantsResult.rows[0].count) || 0,
      todayOrders: parseInt(todayOrdersResult.rows[0].count) || 0,
      todayRevenue: parseFloat(todayRevenueResult.rows[0].total) || 0,
      activeOrders: parseInt(activeOrdersResult.rows[0].count) || 0,
    }

    res.json(stats)
  } catch (err) {
    console.error('Dashboard stats error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
