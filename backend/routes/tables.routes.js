import { Router } from 'express'
import { query } from '../db/db.js'
import authMiddleware from '../tools/authMiddleWare.js'
import QRCode from 'qrcode'
import crypto from 'crypto'

const router = Router()

// GET все столики ресторана
router.get('/', authMiddleware, async (req, res) => {
  const { restaurant_id } = req.query

  try {
    if (!restaurant_id) {
      return res.status(400).json({ message: 'restaurant_id is required' })
    }

    // Проверка доступа
    const accessCheck = await query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurant_id, req.user.id]
    )

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const result = await query(
      'SELECT * FROM tables WHERE restaurant_id = $1 ORDER BY table_number ASC',
      [restaurant_id]
    )

    res.json({
      tables: result.rows,
      count: result.rows.length,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

// POST создать столик с QR-кодом
router.post('/', authMiddleware, async (req, res) => {
  const { restaurant_id, table_number, seats } = req.body

  try {
    // Проверка доступа
    const accessCheck = await query(
      'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
      [restaurant_id, req.user.id]
    )

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // 1. Генерируем случайный токен (уникальный ID для столика)
    const qrToken = crypto.randomBytes(16).toString('hex')

    // 2. Создаем URL который будет в QR-коде
    const menuUrl = `${process.env.FRONTEND_URL}/menu/${qrToken}`

    // 3. Библиотека QRCode СОЗДАЕТ картинку из URL
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 500, // размер QR-кода
      margin: 2, // отступы
      color: {
        dark: '#000000', // цвет квадратиков
        light: '#FFFFFF', // цвет фона
      },
    })

    // 4. Сохраняем в БД
    const result = await query(
      `INSERT INTO tables (restaurant_id, table_number, qr_code_token, qr_code_url, seats)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [restaurant_id, table_number, qrToken, qrCodeDataUrl, seats || 4]
    )

    res.status(201).json({
      message: 'Table created successfully',
      table: result.rows[0],
    })
  } catch (err) {
    console.error(err)

    if (err.code === '23505') {
      return res.status(400).json({
        error: 'Table number already exists for this restaurant',
      })
    }

    res.status(500).json({ error: 'Server Error' })
  }
})

// PATCH обновить столик
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { table_number, seats, is_active } = req.body

  try {
    // Проверка доступа
    const tableCheck = await query(
      `SELECT t.* FROM tables t
       JOIN restaurants r ON t.restaurant_id = r.id
       WHERE t.id = $1 AND r.owner_id = $2`,
      [id, req.user.id]
    )

    if (tableCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied or table not found' })
    }

    const result = await query(
      `UPDATE tables SET
        table_number = COALESCE($1, table_number),
        seats = COALESCE($2, seats),
        is_active = COALESCE($3, is_active)
       WHERE id = $4
       RETURNING *`,
      [table_number, seats, is_active, id]
    )

    res.json({
      message: 'Table updated successfully',
      table: result.rows[0],
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

// DELETE удалить столик
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  try {
    const tableCheck = await query(
      `SELECT t.* FROM tables t
       JOIN restaurants r ON t.restaurant_id = r.id
       WHERE t.id = $1 AND r.owner_id = $2`,
      [id, req.user.id]
    )

    if (tableCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: 'Access denied or table not found' })
    }

    await query('DELETE FROM tables WHERE id = $1', [id])

    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

export default router
