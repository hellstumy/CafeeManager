import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'
import { useState } from 'react'
import EditMenuItemModal from './Modals/EditMenuItemModal'
import { deleteMenuItem } from '../api/api'
import { useTranslation } from 'react-i18next'

export default function MenuCard({ item, onItemUpdated, onItemDeleted }) {
  const { t } = useTranslation()
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false)
  const imageSrc =
    (typeof item?.image_url === 'string' && item.image_url.trim()) ||
    (typeof item?.img_url === 'string' && item.img_url.trim()) ||
    (typeof item?.image === 'string' && item.image.trim()) ||
    menuIMG

  const handleDelete = async () => {
    try {
      await deleteMenuItem(item.id)
      onItemDeleted?.(item.id)
    } catch (err) {
      console.log(err)
      alert(t('alerts.menuDeleteFailed'))
    }
  }
  return (
    <div className="menu-card">
      <img
        className="menu-item_cover"
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = menuIMG
        }}
        src={imageSrc}
        alt={item?.name}
      />
      <div className="menu-item-info">
        <h5 className="menu-item_name">{item?.name}</h5>
        <p className="menu-item_description">{item?.description}</p>
        <p className="menu-price">
          ${item?.price} <span>{item?.categoryName}</span>
        </p>
        <div className="menu-item_setting">
          <button onClick={() => setIsEditMenuItemOpen(true)} type="button">
            {t('main.menuPage.edit')}
          </button>
          <button onClick={handleDelete} type="button">
            <img src={delbtn} alt={t('main.ordersPage.delete')} />
          </button>
        </div>
      </div>
      <EditMenuItemModal
        isOpen={isEditMenuItemOpen}
        onClose={() => setIsEditMenuItemOpen(false)}
        item={item}
        onUpdated={onItemUpdated}
      />
    </div>
  )
}
