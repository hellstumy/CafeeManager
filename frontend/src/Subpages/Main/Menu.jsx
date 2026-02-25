import { useEffect, useState } from 'react'
import MenuCard from '../../Components/MenuCard'
import AddCategoryModal from '../../Components/Modals/AddCategoryModal'
import AddMenuItemModal from '../../Components/Modals/AddMenuItemModal'
import { getMenu } from '../../api/api'
import { useSelectedRest } from '../../store/store'

export default function Menu() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)
  const [menu, setMenu] = useState(null)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  useEffect(() => {
    getMenu(selectedRest).then((data) => {
      setMenu(data)
      setCategories(data.categories)
    })
  }, [selectedRest])

  const allItems = categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, categoryName: category.name }))
  )

  const displayedItems =
    activeCategory === null
      ? allItems
      : allItems.filter((item) => item.category_id === activeCategory)

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
        <li
          className={`category-li ${activeCategory === null ? 'active-li' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All Items ({menu?.total_items ?? 0})
        </li>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`category-li ${activeCategory === category.id ? 'active-li' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name} ({category.items.length})
          </li>
        ))}
      </ul>

      <div className="menu_list">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => <MenuCard key={item.id} item={item} />)
        ) : (
          <p>No items found</p>
        )}
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
