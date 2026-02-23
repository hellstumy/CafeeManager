import menuIMG from '../assets/menuIMG.png'
import delbtn from '../assets/icons/delete.svg'
import { useState } from 'react'
import EditMenuItemModal from './Modals/EditMenuItemModal'
export default function MenuCard() {
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false)
  return (
    <div className="menu-card">
      <img className="menu-item_cover" src={menuIMG} alt="" />
      <div className="menu-item-info">
        <h5 className="menu-item_name">Cappuccino</h5>
        <p className="menu-item_description">
          Espresso with steamed milk and foam
        </p>
        <p className="menu-price">
          $4.50 <span>Coffee</span>
        </p>
        <div className="menu-item_setting">
          <button onClick={() => setIsEditMenuItemOpen(true)}>Edit</button>
          <button>Hide</button>
          <button>
            <img src={delbtn} alt="" />
          </button>
        </div>
      </div>
      <EditMenuItemModal
        isOpen={isEditMenuItemOpen}
        onClose={() => setIsEditMenuItemOpen(false)}
      />
    </div>
  )
}
