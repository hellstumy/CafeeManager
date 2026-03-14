import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { query } from './db/db.js'
import authRoutes from './routes/auth.route.js'
import restaurantsRoutes from './routes/restaurants.route.js'
import menuRoutes from './routes/menu.route.js'
import tablesRoutes from './routes/tables.routes.js'
import orderRoutes from './routes/orders.routes.js'
import StripeRouter from './tools/StripeWebHook.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use('/auth', express.json(), authRoutes)
app.use('/restaurants', express.json(), restaurantsRoutes)
app.use('/menu', express.json(), menuRoutes)
app.use('/tables', express.json(), tablesRoutes)
app.use('/orders', express.json(), orderRoutes)

app.use('/stripe', StripeRouter)

app.get('/', (req, res) => {
  res.send('Test response from backend!')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
