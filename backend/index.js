import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { query } from './db/db.js'
import authRoutes from './routes/auth.route.js'
import restaurantsRoutes from './routes/restaurants.route.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Test response from backend!')
})
app.use('/auth', authRoutes)
app.use('/restaurants', restaurantsRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
