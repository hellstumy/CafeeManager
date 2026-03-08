import CartCard from '../../Components/CartCard'
import Loader from '../../Components/Loader'
import { useTranslation } from 'react-i18next'

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default function Cart({
  items,
  subtotal,
  serviceFee,
  total,
  onBackToMenu,
  onRemoveItem,
  onUpdateQty,
  onUpdateNote,
  onCheckout,
  isSubmitting,
  submitError,
  submitSuccess,
}) {
  const { t } = useTranslation()
  return (
    <div className="cart-page">
      <button className="cart-back-btn" onClick={onBackToMenu} type="button">
        &#8592; {t('client.back')}
      </button>
      <h1>{t('client.title')}</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <h3>{t('client.zerotitle')}</h3>
          <p>{t('client.zero')}</p>
        </div>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <CartCard
              category={item.categoryName}
              imageUrl={item.image_url}
              itemTotal={formatMoney(item.quantity * Number(item.price))}
              key={item.id}
              note={item.note}
              onNoteChange={(value) => onUpdateNote(item.id, value)}
              onQuantityChange={(value) => onUpdateQty(item.id, value)}
              onRemove={() => onRemoveItem(item.id)}
              priceEach={formatMoney(item.price)}
              quantity={item.quantity}
              title={item.name}
            />
          ))}
        </div>
      )}

      <div className="cart-total">
        <h3>{t('client.orderSummary')}</h3>
        <p>
          {t('client.subtotal')} <span>{formatMoney(subtotal)}</span>
        </p>
        <p>
          {t('client.servicefee')} <span>{formatMoney(serviceFee)}</span>
        </p>
        <p className="cart-total-line">
          {t('client.total')} <span>{formatMoney(total)}</span>
        </p>
        {submitError && <p>{submitError}</p>}
        {submitSuccess && <p>{submitSuccess}</p>}
        <button
          className="checkout-btn"
          disabled={items.length === 0 || isSubmitting}
          onClick={onCheckout}
          type="button"
        >
          {isSubmitting ? (
            <>
              <Loader inline label="" size="sm" />
              {t('client.submitting')}
            </>
          ) : (
            t('client.checkout')
          )}
        </button>
      </div>
    </div>
  )
}
