import Stripe from 'stripe'
import { Router } from 'express'
import { query } from '../db/db.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const normalizePlan = (plan) => {
  const normalized = (plan || 'free').toString().toLowerCase()
  if (normalized === 'bussines') return 'business'
  return normalized
}

const epochToDate = (epochSeconds) => {
  if (!epochSeconds || Number.isNaN(Number(epochSeconds))) return null
  return new Date(Number(epochSeconds) * 1000)
}

const addInterval = (date, interval, count = 1) => {
  if (!date || !interval) return null
  const result = new Date(date.getTime())
  const safeCount = Number(count) || 1
  if (interval === 'day') {
    result.setDate(result.getDate() + safeCount)
  } else if (interval === 'week') {
    result.setDate(result.getDate() + safeCount * 7)
  } else if (interval === 'month') {
    result.setMonth(result.getMonth() + safeCount)
  } else if (interval === 'year') {
    result.setFullYear(result.getFullYear() + safeCount)
  } else {
    return null
  }
  return result
}

router.post('/create-checkout', async (req, res) => {
  const { userId, plan } = req.body
  console.log('Received checkout request:', req.body)

  if (!userId || !plan) {
    return res.status(400).json({ error: 'userId and plan are required' })
  }

  const normalizedPlan = normalizePlan(plan)

  if (normalizedPlan === 'free') {
    return res.json({ url: null })
  }

  const priceId =
    normalizedPlan === 'pro'
      ? 'price_1TAyqwHDjuOSOYFPfi9Y8UgX'
      : 'price_1TAytkHDjuOSOYFPg4PrwOqg'

  try {
    const userResult = await query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    )
    const customerEmail = userResult.rows?.[0]?.email || null

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: String(userId), // 🔹 важно для вебхука
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      success_url:
        'https://www.tablekit.uno/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.tablekit.uno/cancel',
      metadata: { plan: normalizedPlan },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Stripe checkout failed' })
  }
})

router.get('/checkout-session', async (req, res) => {
  const sessionId = req.query.session_id
  if (!sessionId) {
    return res.status(400).json({ error: 'session_id is required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })
    const userId = Number(session.client_reference_id)
    const plan = normalizePlan(session.metadata?.plan || 'free')
    let subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id || null
    const customerId = session.customer || null

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid userId in session' })
    }

    let subscription
    let resolvedCustomerId = customerId
    if (session.subscription && typeof session.subscription !== 'string') {
      subscription = session.subscription
    } else if (subscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)
      } catch (err) {
        console.log('Stripe subscription fetch error:', err)
      }
    }

    if ((!subscription || !subscription?.current_period_end) && !resolvedCustomerId) {
      try {
        const userResult = await query(
          'SELECT email FROM users WHERE id = $1',
          [userId]
        )
        const email = userResult.rows?.[0]?.email || null
        if (email && stripe.customers?.search) {
          const search = await stripe.customers.search({
            query: `email:'${email.replace(/'/g, "\\'")}'`,
            limit: 1,
          })
          resolvedCustomerId = search.data?.[0]?.id || resolvedCustomerId
        }
      } catch (err) {
        console.log('Stripe customer search error:', err)
      }
    }

    if (
      (!subscription || !subscription?.current_period_end) &&
      resolvedCustomerId
    ) {
      try {
        const list = await stripe.subscriptions.list({
          customer: resolvedCustomerId,
          status: 'all',
          limit: 1,
        })
        subscriptionId = list.data?.[0]?.id || subscriptionId
        subscription = list.data?.[0] || subscription
      } catch (err) {
        console.log('Stripe subscription list error:', err)
      }
    }

    if (!subscription?.current_period_end && subscriptionId) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        try {
          subscription = await stripe.subscriptions.retrieve(subscriptionId)
        } catch (err) {
          console.log('Stripe subscription fetch error:', err)
        }
        if (subscription?.current_period_end) break
      }
    }

    const subscriptionStatus = subscription?.status || 'active'
    let subscriptionEnd = epochToDate(subscription?.current_period_end)
    if (!subscriptionEnd) {
      subscriptionEnd = epochToDate(subscription?.trial_end)
    }
    if (!subscriptionEnd) {
      const interval =
        subscription?.items?.data?.[0]?.price?.recurring?.interval || null
      const intervalCount =
        subscription?.items?.data?.[0]?.price?.recurring?.interval_count || 1
      const startEpoch =
        subscription?.current_period_start || subscription?.start_date || null
      const startDate = epochToDate(startEpoch)
      subscriptionEnd = addInterval(startDate, interval, intervalCount)
    }

    await query(
      `UPDATE users
       SET plan = $1,
           subscription_status = $2,
           subscription_end = $3,
           stripe_customer_id = $4,
           stripe_subscription_id = $5
       WHERE id = $6`,
      [
        plan,
        subscriptionStatus,
        subscriptionEnd,
        resolvedCustomerId,
        subscriptionId,
        userId,
      ]
    )

    return res.json({
      ok: true,
      subscription_end: subscriptionEnd,
      plan,
    })
  } catch (err) {
    console.error('Checkout session sync error:', err)
    return res.status(500).json({ error: 'Failed to sync subscription' })
  }
})

export default router
