import CartCard from '../../Components/CartCard'

export default function Cart() {
  return (
    <div className="cart-page">
      <button className="cart-back-btn" type="button">
        &#8592; Back to Menu
      </button>
      <h1>Your Cart</h1>

      <div className="cart-list">
        <CartCard
          category="Coffee"
          itemTotal="$9.00"
          priceEach="$4.50"
          quantity="2"
          title="Cappuccino"
        />
        <CartCard
          category="Breakfast"
          itemTotal="$3.20"
          note="Warm it up, please"
          priceEach="$3.20"
          quantity="1"
          title="Croissant"
        />
        <CartCard
          category="Breakfast"
          itemTotal="$3.20"
          note="Warm it up, please"
          priceEach="$3.20"
          quantity="1"
          title="Croissant"
        />
        <CartCard
          category="Breakfast"
          itemTotal="$3.20"
          note="Warm it up, please"
          priceEach="$3.20"
          quantity="1"
          title="Croissant"
        />
      </div>

      <div className="cart-total">
        <h3>Order Summary</h3>
        <p>
          Subtotal <span>$12.20</span>
        </p>
        <p>
          Service Fee <span>$1.50</span>
        </p>
        <p className="cart-total-line">
          Total <span>$13.70</span>
        </p>
        <button className="checkout-btn" type="button">
          Checkout
        </button>
      </div>
    </div>
  )
}
