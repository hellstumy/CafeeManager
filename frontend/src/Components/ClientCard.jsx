import menuIMG from '../assets/menuIMG.png'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default function ClientCard({ item, categoryName, onAdd }) {
  const { t } = useTranslation()
  const [isAdded, setIsAdded] = useState(false)
  const resetTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const imageSrc =
    typeof item.image_url === 'string' && item.image_url.trim()
      ? item.image_url
      : menuIMG

  function handleAddClick() {
    onAdd(item)
    setIsAdded(true)

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = setTimeout(() => {
      setIsAdded(false)
    }, 900)
  }

  return (
    <div className="client-card">
      <img
        alt={item.name}
        className="client-card_img"
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
          {item.description || t('client.noDescription')}
        </p>
        <div className="client-card_other">
          <p className="clirnt-price">{formatMoney(item.price)}</p>
          <button
            className={`add-Btn ${isAdded ? 'add-Btn-added' : ''}`}
            onClick={handleAddClick}
            type="button"
          >
            {isAdded ? t('client.added') : t('client.add')}
          </button>
        </div>
      </div>
    </div>
  )
}
