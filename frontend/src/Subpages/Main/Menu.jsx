import { useState } from 'react'
import MenuCard from '../../Components/MenuCard'
import AddCategoryModal from '../../Components/Modals/AddCategoryModal'
import AddMenuItemModal from '../../Components/Modals/AddMenuItemModal'

export default function Menu() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)
  return (
    <div className="menu-page">
      <div className="menu-title">
        <h1>Menu Management</h1>
        <div className="menu-title_buttons">
          <button onClick={() => setIsAddCategoryOpen(true)}>
            Add Category
          </button>
          <button onClick={() => setIsAddMenuItemOpen(true)}>Add Item</button>
        </div>
      </div>
      <p className="subtitle">Manage your restaurant menu items</p>
      <ul className="categoies_list">
        <li className="category-li active-li">All Items (5)</li>
        <li className="category-li">Coffee (2)</li>
        <li className="category-li">Breakfast (1)</li>
        <li className="category-li">Lunch (0)</li>
        <li className="category-li">Salads (1)</li>
        <li className="category-li">Desserts (1)</li>
      </ul>
      <div className="menu_list">
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </div>
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />
      <AddMenuItemModal
        isOpen={isAddMenuItemOpen}
        onClose={() => setIsAddMenuItemOpen(false)}
      />
    </div>
  )
}
