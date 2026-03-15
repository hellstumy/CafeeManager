import { Link } from 'react-router-dom'

export default function PaymentCancel() {
  return (
    <section className="payment-status-page">
      <div className="payment-status-card">
        <h1>Оплата отменена</h1>
        <Link className="payment-status-btn" to="/main">
          Вернуться на главную
        </Link>
      </div>
    </section>
  )
}
