import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL

export default function PaymentSuccess() {
  const { search } = useLocation()
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    const params = new URLSearchParams(search)
    const sessionId = params.get('session_id')
    if (!sessionId) return

    const sync = async () => {
      try {
        setSyncStatus('loading')
        const res = await fetch(
          `${API_BASE_URL}/stripe/checkout-session?session_id=${sessionId}`
        )
        if (!res.ok) {
          throw new Error('Failed to sync subscription')
        }
        setSyncStatus('success')
      } catch (err) {
        console.error('Subscription sync error:', err)
        setSyncStatus('error')
      }
    }

    sync()
  }, [search])

  return (
    <section className="payment-status-page">
      <div className="payment-status-card">
        <h1>Оплата успешна</h1>
        <p className="subtitle">
          {syncStatus === 'loading'
            ? 'Синхронизация подписки...'
            : 'Перезапустите страницу'}
        </p>
        <Link className="payment-status-btn" to="/main">
          Вернуться на главную
        </Link>
      </div>
    </section>
  )
}
