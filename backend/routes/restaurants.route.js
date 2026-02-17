import { Router } from 'express'
import { query } from '../db/db.js'
import authMiddleware from '../tools/authMiddleWare.js'
const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch restaurants' })
  }
})
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, logo_url, address, phone, working_hours } =
    req.body
  try {
    const result = await query(
      `INSERT INTO restaurants (name, description, logo_url, address, phone, working_hours, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, logo_url, address, phone, working_hours, req.user.id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create restaurant' })
  }
})
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { name, description, logo_url, address, phone, working_hours } =
    req.body
  try {
    // Проверяем, что ресторан принадлежит текущему пользователю
    const check = await query(
      'SELECT * FROM restaurants WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    )
    const chekOwner = await query('SELECT * FROM users WHERE id = $1', [
      req.user.id,
    ])
    if (chekOwner.rows[0].role !== 'owner') {
      return res.status(403).json({
        message:
          'Forbidden: You do not have permission to edit this restaurant',
      })
    }
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    const result = await query(
      `UPDATE restaurants SET name = COALESCE($1, name), description = COALESCE($2, description), logo_url = COALESCE($3, logo_url),
       address = COALESCE($4, address), phone = COALESCE($5, phone), working_hours = COALESCE($6, working_hours) WHERE id = $7 RETURNING *`,
      [name, description, logo_url, address, phone, working_hours, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update restaurant' })
  }
})

// TODO: Создать БД и роут для оффициантов

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  try {
    // Проверяем, что ресторан принадлежит текущему пользователю
    const check = await query(
      'SELECT * FROM restaurants WHERE id = $1 AND owner_id = $2',
      [id, req.user.id]
    )
    const chekOwner = await query('SELECT * FROM users WHERE id = $1', [
      req.user.id,
    ])
    if (chekOwner.rows[0].role !== 'owner') {
      return res.status(403).json({
        message:
          'Forbidden: You do not have permission to delete this restaurant',
      })
    }
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    await query('DELETE FROM restaurants WHERE id = $1', [id])
    res.json({ message: 'Restaurant deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete restaurant' })
  }
})
export default router
