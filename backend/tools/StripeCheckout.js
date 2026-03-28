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

router.post('/create-checkout', async (req, res) => {
  const { userId, plan } = req.body
  console.log('Received checkout request:', req.body)

  if (!userId || !plan) {
    return res.status(400).json({ error: 'userId and plan are required' })
  }

  if (plan === 'free') {
    return res.json({ url: null })
  }

  const priceId =
    plan === 'Pro'
      ? 'price_1TAyqwHDjuOSOYFPfi9Y8UgX'
      : 'price_1TAytkHDjuOSOYFPg4PrwOqg'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: String(userId), // 🔹 важно для вебхука
      success_url:
        'https://www.tablekit.uno/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.tablekit.uno/cancel',
      metadata: { plan },
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
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const userId = Number(session.client_reference_id)
    const plan = normalizePlan(session.metadata?.plan || 'free')
    let subscriptionId = session.subscription || null
    const customerId = session.customer || null

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid userId in session' })
    }

    let subscription
    if (!subscriptionId && customerId) {
      try {
        const list = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          limit: 1,
        })
        subscriptionId = list.data?.[0]?.id || null
      } catch (err) {
        console.log('Stripe subscription list error:', err)
      }
    }

    if (subscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId)
      } catch (err) {
        console.log('Stripe subscription fetch error:', err)
      }
    }

    const subscriptionStatus = subscription?.status || 'active'
    const subscriptionEnd = epochToDate(subscription?.current_period_end)

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
        customerId,
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
