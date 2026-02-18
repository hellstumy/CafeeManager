import { Router } from 'express'
import { query } from '../db/db.js'
import authMiddleware from '../tools/authMiddleWare.js'
const router = Router()

// Menu
router.get('/', async (req, res) => {
  const { restaurant_id } = req.query

  try {
    if (!restaurant_id) {
      return res.status(400).json({ message: 'restaurant_id is required' })
    }

    // Получаем категории
    const categoriesResult = await query(
      `SELECT * FROM categories 
       WHERE restaurant_id = $1 AND is_active = true
       ORDER BY position ASC`,
      [restaurant_id]
    )

    // Получаем все блюда
    const itemsResult = await query(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND is_available = true
       ORDER BY position ASC`,
      [restaurant_id]
    )

    // Группируем блюда по категориям
    const menu = categoriesResult.rows.map((category) => ({
      id: category.id,
      name: category.name,
      position: category.position,
      items: itemsResult.rows.filter(
        (item) => item.category_id === category.id
      ),
    }))

    // Блюда без категории (если есть)
    const uncategorized = itemsResult.rows.filter((item) => !item.category_id)
    if (uncategorized.length > 0) {
      menu.push({
        id: null,
        name: 'Uncategorized',
        position: 999,
        items: uncategorized,
      })
    }

    res.json({
      restaurant_id: parseInt(restaurant_id),
      categories: menu,
      total_items: itemsResult.rows.length,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server Error' })
  }
})

// Category
router.get('/category/:restID', async (req, res) => {
  const restID = req.params.restID
  try {
    const result = await query(
      `
      SELECT * from categories WHERE restaurant_id = $1
      `,
      [restID]
    )
    res.status(200).send(result.rows)
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})
router.post('/category', async (req, res) => {
  const { restaurant_id, name, position } = req.body
  try {
    const result = await query(
      `INSERT INTO categories(restaurant_id, name, position) VALUES($1, $2, $3) RETURNING *`,
      [restaurant_id, name, position]
    )
    res.status(201).send(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})
router.patch('/category/:id', async (req, res) => {
  const id = req.params.id
  const { name, position, is_active } = req.body
  try {
    const result = await query(
      `
        UPDATE categories SET name = COALESCE($1, name),  position = COALESCE($2, position), is_active = COALESCE($3, is_active)
        WHERE id = $4
        RETURNING * 
      `,
      [name, position, is_active, id]
    )
    res.status(200).send(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})
router.delete('/category/:id', async (req, res) => {
  const id = req.params.id
  try {
    await query(`DELETE FROM categories WHERE id = $1`, [id])
    res.status(204).send('Deleted Succesfully')
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})
// Menu Items
router.post('/menuItem', async (req, res) => {
  const {
    restaurant_id,
    category_id,
    name,
    description,
    price,
    img_url,
    tags,
  } = req.body
  try {
    const result = await query(
      `
        INSERT INTO menu_items(restaurant_id, category_id, name, description, price, image_url, tags)
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `,
      [restaurant_id, category_id, name, description, price, img_url, tags]
    )
    res.status(201).send(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error')
  }
})
router.patch('/menuItem/:id', async (req, res) => {
  const id = req.params.id
  const { category_id, name, description, price, img_url, tags } = req.body
  try {
    const result = await query(
      `
        UPDATE menu_items SET category_id = COALESCE($1, category_id), name = COALESCE($2, name), 
        description = COALESCE($3, description), price = COALESCE($4, price), image_url = COALESCE($5, image_url),
        tags = COALESCE($6, tags), updated_at = NOW()
        WHERE id = $7 RETURNING *
      `,
      [category_id, name, description, price, img_url, tags, id]
    )
    res.status(200).send(result.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})
router.delete('/menuItem/:id', async (req, res) => {
  const id = req.params.id
  try {
    await query(`DELETE FROM menu_items WHERE id = $1`, [id])
    res.status(204).send('Deleted succesfully')
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

export default router
