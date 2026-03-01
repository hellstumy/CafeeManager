import menuIMG from '../assets/menuIMG.png'

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default function ClientCard({ item, categoryName, onAdd }) {
  const imageSrc =
    typeof item.image_url === 'string' && item.image_url.trim()
      ? item.image_url
      : menuIMG

  return (
    <div className="client-card">
      <img
        alt={item.name}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = menuIMG
        }}
        src={imageSrc}
      />
      <div className="client-card_info">
        <h3 className="client-card_title">
          {item.name} <span>{categoryName}</span>
        </h3>
        <p className="client-card_description">
          {item.description || 'No description available'}
        </p>
        <div className="client-card_other">
          <p className="clirnt-price">{formatMoney(item.price)}</p>
          <button className="add-Btn" onClick={() => onAdd(item)} type="button">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
