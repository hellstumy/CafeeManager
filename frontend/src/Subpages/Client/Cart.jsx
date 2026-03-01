import CartCard from '../../Components/CartCard'
import Loader from '../../Components/Loader'

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
  return (
    <div className="cart-page">
      <button className="cart-back-btn" onClick={onBackToMenu} type="button">
        &#8592; Back to Menu
      </button>
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <h3>Cart is empty</h3>
          <p>Add items from the menu to place an order.</p>
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
        <h3>Order Summary</h3>
        <p>
          Subtotal <span>{formatMoney(subtotal)}</span>
        </p>
        <p>
          Service Fee <span>{formatMoney(serviceFee)}</span>
        </p>
        <p className="cart-total-line">
          Total <span>{formatMoney(total)}</span>
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
              Submitting...
            </>
          ) : (
            'Checkout'
          )}
        </button>
      </div>
    </div>
  )
}
