import Stripe from 'stripe'
import { Router } from 'express'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout', async (req, res) => {
  const { userId, plan } = req.body

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
      userId,
      plan,
    },
  })

  res.json({ url: session.url })
})

export default router
