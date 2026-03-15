import Stripe from 'stripe'
import { Router } from 'express'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout', async (req, res) => {
  let { userId, plan } = req.body
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
      : 'price_1TAytkHDjuOSOYFPg4PrwOqg' // business

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],

      success_url: 'https://www.tablekit.uno/success',
      cancel_url: 'https://www.tablekit.uno/cancel',

      metadata: {
        userId: String(userId),
        plan: plan,
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Stripe checkout failed' })
  }
})

export default router
