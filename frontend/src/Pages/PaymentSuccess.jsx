import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <section className="payment-status-page">
      <div className="payment-status-card">
        <h1>Оплата успешна</h1>
        <p className="subtitle">Перезапустите страницу</p>
        <Link className="payment-status-btn" to="/main">
          Вернуться на главную
        </Link>
      </div>
    </section>
  )
}
