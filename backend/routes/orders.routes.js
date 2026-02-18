import { Router } from 'express'
import { query } from '../db/db.js'
import authMiddleware from '../tools/authMiddleWare.js'

const router = Router()

router.post('/', async (req, res) => {
  const { table_id, items, notes } = req.body

  try {
    // Начинаем транзакцию
    await query('BEGIN')

    // 1. Получить restaurant_id
    const tableResult = await query(
      'SELECT restaurant_id FROM tables WHERE id = $1',
      [table_id]
    )
    const restaurant_id = tableResult.rows[0].restaurant_id

    // 2. Получить цены ВСЕХ блюд ОДНИМ запросом
    const menuItemIds = items.map((item) => item.menu_item_id)

    const menuItemsResult = await query(
      'SELECT id, price, is_available FROM menu_items WHERE id = ANY($1) AND restaurant_id = $2',
      [menuItemIds, restaurant_id]
    )

    // Создаем Map для быстрого поиска
    const menuItemsMap = new Map(
      menuItemsResult.rows.map((item) => [item.id, item])
    )

    // Проверка и расчет total
    let total = 0
    const itemsData = []

    for (const item of items) {
      const menuItem = menuItemsMap.get(item.menu_item_id)

      if (!menuItem) {
        await query('ROLLBACK')
        return res.status(404).json({
          message: `Menu item ${item.menu_item_id} not found`,
        })
      }

      if (!menuItem.is_available) {
        await query('ROLLBACK')
        return res.status(400).json({
          message: `Menu item ${item.menu_item_id} is not available`,
        })
      }

      total += parseFloat(menuItem.price) * item.quantity

      itemsData.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || null,
      })
    }

    // 3. Создать заказ
    const orderResult = await query(
      `INSERT INTO orders (restaurant_id, table_id, status, total_amount, notes)
       VALUES ($1, $2, 'pending', $3, $4)
       RETURNING *`,
      [restaurant_id, table_id, total, notes]
    )

    const order = orderResult.rows[0]

    // 4. ВСТАВИТЬ ВСЕ order_items ОДНИМ ЗАПРОСОМ! 🚀
    const values = []
    const placeholders = []
    let paramCounter = 1

    itemsData.forEach((item, index) => {
      values.push(
        order.id,
        item.menu_item_id,
        item.quantity,
        item.price,
        item.notes
      )

      placeholders.push(
        `($${paramCounter}, $${paramCounter + 1}, $${paramCounter + 2}, $${paramCounter + 3}, $${paramCounter + 4})`
      )

      paramCounter += 5
    })

    await query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price, notes)
       VALUES ${placeholders.join(', ')}`,
      values
    )

    // Завершаем транзакцию
    await query('COMMIT')

    // 5. Получить полный заказ
    const fullOrder = await query(
      `SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'menu_item_id', oi.menu_item_id,
            'menu_item_name', mi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'notes', oi.notes
          )
        ) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE o.id = $1
       GROUP BY o.id`,
      [order.id]
    )

    res.status(201).json({
      message: 'Order created successfully',
      order: fullOrder.rows[0],
    })
  } catch (err) {
    await query('ROLLBACK')
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Server Error' })
  }
})
router.get('/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params

  try {
    const result = await query(
      `
      SELECT 
        o.id AS order_id,
        o.restaurant_id AS order_restaurant_id,
        o.table_id,
        t.table_number,
        o.status,
        o.total_amount,
        o.notes,
        o.created_at,
        o.updated_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'menu_item_id', oi.menu_item_id,
            'menu_item_name', mi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'notes', oi.notes
          )
        ) FILTER (WHERE oi.id IS NOT NULL) AS items
      FROM orders o
      LEFT JOIN tables t ON t.id = o.table_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
      WHERE o.restaurant_id = $1
      GROUP BY o.id, t.table_number
      ORDER BY o.created_at DESC
      `,
      [restaurantId]
    )

    res.json({
      count: result.rows.length,
      orders: result.rows,
    })
  } catch (err) {
    console.error('Get restaurant orders error:', err)
    res.status(500).json({ error: 'Server Error' })
  }
})

router.patch('/:orderId', async (req, res) => {
  const { orderId } = req.params
  const { notes, status } = req.body

  try {
    // Обновляем заказ
    const updated = await query(
      `
      UPDATE orders
      SET 
        notes = COALESCE($1, notes),
        status = COALESCE($2, status),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [notes, status, orderId]
    )

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order updated', order: updated.rows[0] })
  } catch (err) {
    console.error('Edit order error:', err)
    res.status(500).json({ error: 'Server Error' })
  }
})

router.delete('/:orderId', async (req, res) => {
  const { orderId } = req.params

  try {
    await query('BEGIN')

    // Сначала удаляем позиции заказа
    await query(`DELETE FROM order_items WHERE order_id = $1`, [orderId])

    // Потом сам заказ
    const deleted = await query(
      `DELETE FROM orders WHERE id = $1 RETURNING *`,
      [orderId]
    )

    await query('COMMIT')

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order deleted successfully', order: deleted.rows[0] })
  } catch (err) {
    await query('ROLLBACK')
    console.error('Delete order error:', err)
    res.status(500).json({ error: 'Server Error' })
  }
})

async function deleteOldOrders() {
  try {
    const now = new Date()

    // Удаляем заказы, у которых статус completed/cancelled и прошло > 1 часа
    await query(
      `
      DELETE FROM orders
      WHERE status IN ('completed', 'cancelled')
        AND updated_at <= NOW() - INTERVAL '1 hour'
      `
    )

    console.log('Old orders cleanup done:', now)
  } catch (err) {
    console.error('Error deleting old orders:', err)
  }
}

// Запускаем каждые 5 минут
setInterval(deleteOldOrders, 5 * 60 * 1000)
export default router
