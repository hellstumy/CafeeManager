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

  // если выбрали бесплатный план — сразу возвращаем null
  if (plan === 'free') {
    return res.json({ url: null })
  }

  // выбор priceId по плану
  const priceId =
    plan === 'Pro'
      ? 'price_1TAyqwHDjuOSOYFPfi9Y8UgX'
      : 'price_1TAytkHDjuOSOYFPg4PrwOqg' // business

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],

      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',

      metadata: {
        userId: String(userId), // всегда строка, чтобы потом в вебхуке можно было Number()
        plan: plan, // 'pro' или 'business'
      },
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: 'Stripe checkout failed' })
  }
})

export default router
