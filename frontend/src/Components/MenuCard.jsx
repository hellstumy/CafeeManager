import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'
import { useState } from 'react'
import EditMenuItemModal from './Modals/EditMenuItemModal'

export default function MenuCard({ item }) {
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false)

  return (
    <div className="menu-card">
      <img
        className="menu-item_cover"
        src={item?.image || menuIMG}
        alt={item?.name}
      />
      <div className="menu-item-info">
        <h5 className="menu-item_name">{item?.name}</h5>
        <p className="menu-item_description">{item?.description}</p>
        <p className="menu-price">
          ${item?.price} <span>{item?.categoryName}</span>
        </p>
        <div className="menu-item_setting">
          <button onClick={() => setIsEditMenuItemOpen(true)}>Edit</button>
          <button>Hide</button>
          <button>
            <img src={delbtn} alt="delete" />
          </button>
        </div>
      </div>
      <EditMenuItemModal
        isOpen={isEditMenuItemOpen}
        onClose={() => setIsEditMenuItemOpen(false)}
        item={item}
      />
    </div>
  )
}
