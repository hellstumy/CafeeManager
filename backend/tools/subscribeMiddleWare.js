import { PLAN_LIMITS } from '../config/subscribeLimits.js'
import { query } from '../db/db.js'

const RESOURCE_QUERIES = {
  restaurants: 'SELECT COUNT(*) FROM restaurants WHERE owner_id = $1',
  tables: 'SELECT COUNT(*) FROM tables WHERE restaurant_id = $1',
  menuItems: 'SELECT COUNT(*) FROM menu_items WHERE restaurant_id = $1',
}

const normalizePlan = (plan) => {
  const normalized = (plan || 'free').toString().toLowerCase()
  if (normalized === 'bussines') return 'business'
  return normalized
}

const subscribeMiddleWare = (resource) => async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const planResult = await query(
      'SELECT plan, subscription_end FROM users WHERE id = $1',
      [req.user.id]
    )
    const rawPlan = planResult.rows?.[0]?.plan
    const subscriptionEnd = planResult.rows?.[0]?.subscription_end
    let plan = normalizePlan(rawPlan)

    if (subscriptionEnd && new Date(subscriptionEnd) <= new Date()) {
      if (plan !== 'free') {
        await query(
          `UPDATE users
           SET plan = 'free', subscription_status = 'expired', subscription_end = NULL
           WHERE id = $1`,
          [req.user.id]
        )
      }
      plan = 'free'
    }
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free
    const limit = limits?.[resource]

    if (limit === undefined) {
      return res.status(500).json({ error: 'Unknown subscription limit' })
    }

    if (limit === Infinity) {
      return next()
    }

    let countParams
    if (resource === 'restaurants') {
      countParams = [req.user.id]
    } else {
      const restaurantId = Number(req.body?.restaurant_id)
      if (!restaurantId) {
        return res
          .status(400)
          .json({ message: 'restaurant_id is required' })
      }

      const accessCheck = await query(
        'SELECT id FROM restaurants WHERE id = $1 AND owner_id = $2',
        [restaurantId, req.user.id]
      )
      if (accessCheck.rows.length === 0) {
        return res.status(403).json({ message: 'Access denied' })
      }

      countParams = [restaurantId]
    }

    const countResult = await query(RESOURCE_QUERIES[resource], countParams)
    const count = Number(countResult.rows?.[0]?.count || 0)

    if (count >= limit) {
      return res.status(403).json({
        code: 'SUBSCRIPTION_LIMIT_REACHED',
        message: 'SUBSCRIPTION_LIMIT_REACHED',
        resource,
        limit,
        count,
        plan,
      })
    }

    return next()
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Server Error' })
  }
}

export default subscribeMiddleWare
