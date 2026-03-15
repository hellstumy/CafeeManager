import Stripe from 'stripe'
import { query } from '../db/db.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhook = async (req, res) => {
  console.log('⚡ Stripe webhook received')

  const sig = req.headers['stripe-signature']

  let event
  try {
    // ⚡ используем raw body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('Webhook event type:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = Number(session.client_reference_id)
    const plan = session.metadata?.plan || 'free'

    if (!userId || Number.isNaN(userId)) {
      console.log('Invalid userId in webhook:', session)
      return res.status(400).send('Invalid userId')
    }

    try {
      await query(
        `UPDATE users
         SET plan = $1, subscription_status = 'active'
         WHERE id = $2`,
        [plan, userId]
      )
      console.log(`Subscription activated for user ${userId} with plan ${plan}`)
    } catch (err) {
      console.log('DB error:', err)
      return res.status(500).send('Database error')
    }
  }

  res.sendStatus(200)
}
