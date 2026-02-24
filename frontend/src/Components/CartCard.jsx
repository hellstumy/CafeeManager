import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'

export default function CartCard({
  title,
  category,
  priceEach,
  quantity,
  itemTotal,
  note,
}) {
  return (
    <div className="cart-card">
      <img src={menuIMG} alt={title} />
      <div className="cart-card-info">
        <div className="cart-card-title">
          <h4>
            {title} <span>{category}</span>
          </h4>
          <button className="cart-delete-btn" type="button">
            <img src={delbtn} alt="Delete item" />
          </button>
        </div>
        <p className="price-for-each">{priceEach} each</p>
        <label className="cart-input-label">
          Quantity
          <input className="cart-qty-input" min="1" type="number" defaultValue={quantity} />
        </label>
        <p className="cart-card-price">Item total: {itemTotal}</p>
        <label className="cart-input-label">
          Note for kitchen
          <textarea
            className="cart-note-input"
            placeholder="No sugar, extra hot, allergies..."
            defaultValue={note}
          />
        </label>
      </div>
    </div>
  )
}
