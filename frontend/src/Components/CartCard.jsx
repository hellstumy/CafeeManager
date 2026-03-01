import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'

export default function CartCard({
  imageUrl,
  title,
  category,
  priceEach,
  quantity,
  itemTotal,
  note,
  onRemove,
  onQuantityChange,
  onNoteChange,
}) {
  const safeImageSrc =
    typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl : menuIMG

  return (
    <div className="cart-card">
      <img
        alt={title}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = menuIMG
        }}
        src={safeImageSrc}
      />
      <div className="cart-card-info">
        <div className="cart-card-title">
          <h4>
            {title} <span>{category}</span>
          </h4>
          <button className="cart-delete-btn" onClick={onRemove} type="button">
            <img src={delbtn} alt="Delete item" />
          </button>
        </div>
        <p className="price-for-each">{priceEach} each</p>
        <label className="cart-input-label">
          Quantity
          <input
            className="cart-qty-input"
            min="1"
            onChange={(e) => onQuantityChange(e.target.value)}
            type="number"
            value={quantity}
          />
        </label>
        <p className="cart-card-price">Item total: {itemTotal}</p>
        <label className="cart-input-label">
          Note for kitchen
          <textarea
            className="cart-note-input"
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="No sugar, extra hot, allergies..."
            value={note}
          />
        </label>
      </div>
    </div>
  )
}
