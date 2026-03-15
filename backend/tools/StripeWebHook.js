import Stripe from 'stripe'
import { query } from '../db/db.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhook = async (req, res) => {
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
      await query(
        `UPDATE users 
         SET plan = $1, subscription_status = 'active'
         WHERE id = $2`,
        [plan, userId]
      )

      console.log('Subscription activated')
    } catch (err) {
      console.log('DB error:', err)
    }
  }

  res.sendStatus(200)
}
