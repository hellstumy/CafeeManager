import { useEffect, useState } from 'react'
import MenuCard from '../../Components/MenuCard'
import AddCategoryModal from '../../Components/Modals/AddCategoryModal'
import AddMenuItemModal from '../../Components/Modals/AddMenuItemModal'
import { getMenu } from '../../api/api'
import { useSelectedRest } from '../../store/store'
import MenuLoader from '../../Ui/Skeleton/MenuLoader'

export default function Menu() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  const fetchMenu = () => {
    if (!selectedRest) {
      setCategories([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    getMenu(selectedRest).then((data) => {
      setCategories(data.categories || [])
    }).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchMenu()
  }, [selectedRest])

  const totalItems = categories.reduce(
    (sum, category) => sum + category.items.length,
    0
  )

  const handleCategoryCreated = (category) => {
    if (!category?.id) {
      fetchMenu()
      return
    }

    setCategories((prev) => {
      const exists = prev.some((item) => item.id === category.id)
      if (exists) return prev
      return [...prev, { ...category, items: [] }]
    })
  }

  const handleMenuItemCreated = (item) => {
    if (!item?.id) {
      fetchMenu()
      return
    }

    setCategories((prev) => {
      const hasCategory = prev.some((category) => category.id === item.category_id)
      if (!hasCategory) {
        fetchMenu()
        return prev
      }

      return prev.map((category) =>
        category.id === item.category_id
          ? { ...category, items: [...category.items, item] }
          : category
      )
    })
  }

  const handleMenuItemUpdated = (updatedItem) => {
    if (!updatedItem?.id) {
      fetchMenu()
      return
    }

    setCategories((prev) => {
      const hasCategory = prev.some(
        (category) => category.id === updatedItem.category_id
      )
      if (!hasCategory) {
        fetchMenu()
        return prev
      }

      const withoutItem = prev.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== updatedItem.id),
      }))

      return withoutItem.map((category) =>
        category.id === updatedItem.category_id
          ? { ...category, items: [...category.items, updatedItem] }
          : category
      )
    })
  }

  const handleMenuItemDeleted = (deletedItemId) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== deletedItemId),
      }))
    )
  }

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
          All Items ({totalItems})
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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <MenuLoader key={index} />)
        ) : displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onItemDeleted={handleMenuItemDeleted}
              onItemUpdated={handleMenuItemUpdated}
            />
          ))
        ) : (
          <p className="subtitle">No items found</p>
        )}
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onCreated={handleCategoryCreated}
      />
      <AddMenuItemModal
        isOpen={isAddMenuItemOpen}
        onClose={() => setIsAddMenuItemOpen(false)}
        onCreated={handleMenuItemCreated}
      />
    </div>
  )
}
