import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import StripeCheckout from './tools/StripeCheckout.js'
import { stripeWebhook } from './tools/StripeWebHook.js'

import authRoutes from './routes/auth.route.js'
import restaurantsRoutes from './routes/restaurants.route.js'
import menuRoutes from './routes/menu.route.js'
import tablesRoutes from './routes/tables.routes.js'
import orderRoutes from './routes/orders.routes.js'

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors({ origin: true, credentials: true }))

app.use(express.json())
app.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
)
app.use('/auth', authRoutes)
app.use('/restaurants', restaurantsRoutes)
app.use('/menu', menuRoutes)
app.use('/tables', tablesRoutes)
app.use('/orders', orderRoutes)

// Stripe checkout
app.use('/stripe', StripeCheckout)

app.get('/', (req, res) => {
  res.send('Backend running')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
