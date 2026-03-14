import Stripe from 'stripe'
import { Router } from 'express'
import { query } from '../db/db.js'
const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout', async (req, res) => {
  const { userId, plan } = req.body // plan = "pro" или "Business"
  if (plan === 'free') {
    return res.json({ url: null })
  }
  const priceId =
    plan === 'Pro'
      ? 'price_1TAyqwHDjuOSOYFPfi9Y8UgX'
      : 'price_1TAytkHDjuOSOYFPg4PrwOqg'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',

    line_items: [{ price: priceId, quantity: 1 }],

    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',

    metadata: {
      userId: userId,
      plan: plan, // Pro / Business
    },
  })

  res.json({ url: session.url })
})

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.log('Webhook error:', err.message)
      return res.sendStatus(400)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata.userId
      const plan = session.metadata.plan

      try {
        const result = await query(
          `UPDATE users SET plan = $1, subscription_status = 'active' WHERE id = $2 RETURNING *`,
          [plan, userId]
        )
        console.log('DB updated:', result)
      } catch (err) {
        console.log('DB error:', err)
      }
    }

    res.sendStatus(200)
  }
)
export default router
