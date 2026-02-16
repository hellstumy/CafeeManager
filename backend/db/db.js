import pkg from 'pg'
import 'dotenv/config'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Обязательно для облачных баз типа Railway
  },
})

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Ошибка подключения к базе:', err.stack)
  }
  console.log('✅ Succesfull connection PostgreSQL (Railway)')
  release() // Освобождаем клиент обратно в пул
})

export const query = (text, params) => pool.query(text, params)
