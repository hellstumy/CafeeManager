import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
            <img src={delbtn} alt={t('client.deleteItemAlt')} />
          </button>
        </div>
        <p className="price-for-each">
          {priceEach} {t('client.priceEach')}
        </p>
        <label className="cart-input-label">
          {t('client.quantity')}
          <input
            className="cart-qty-input"
            min="1"
            onChange={(e) => onQuantityChange(e.target.value)}
            type="number"
            value={quantity}
          />
        </label>
        <p className="cart-card-price">
          {t('client.itemTotalLabel')}: {itemTotal}
        </p>
        <label className="cart-input-label">
          {t('client.note')}
          <textarea
            className="cart-note-input"
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={t('client.notePlaceholder')}
            value={note}
          />
        </label>
      </div>
    </div>
  )
}
