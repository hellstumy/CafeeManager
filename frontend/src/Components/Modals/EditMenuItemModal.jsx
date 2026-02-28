import './Modal.css'
import { useEffect, useState } from 'react'
import { getCategory, updateMenuItem } from '../../api/api'
import { useSelectedRest } from '../../store/store'

export default function EditMenuItemModal({ isOpen, onClose, item, onUpdated }) {
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [img_url, setImg_url] = useState('')
  const [price, setPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!selectedRest) return

    getCategory(selectedRest).then((data) => setCategories(data))
  }, [selectedRest])

  useEffect(() => {
    if (!item) return

    setName(item.name || '')
    setDescription(item.description || '')
    setImg_url(item.image_url || item.img_url || '')
    setPrice(item.price ?? '')
    setSelectedCategory(item.category_id ?? '')
  }, [item, isOpen])

  if (!isOpen) return null

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!item?.id) return

    setIsSubmitting(true)
    try {
      const updatedItem = await updateMenuItem(item.id, {
        category_id: selectedCategory ? Number(selectedCategory) : null,
        name,
        description,
        img_url,
        price: Number(price),
      })

      onUpdated?.(updatedItem)
      onClose()
    } catch (err) {
      console.log(err)
      alert('Failed to update menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Edit Menu Item</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form" onSubmit={handleUpdate}>
          <label>
            <p className="form-p">Item Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cappuccino"
              className="form-input"
              type="text"
            />
          </label>
          <label>
            <p className="form-p">Description</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the item"
              className="form-input"
              type="text"
            />
          </label>
          <label>
            <p className="form-p">Image URL</p>
            <input
              value={img_url}
              onChange={(e) => setImg_url(e.target.value)}
              placeholder="https://picsum.photos/seed/picsum/200/300"
              className="form-input"
              type="text"
            />
          </label>
          <div className="form-cont">
            <label>
              <p className="form-p">Price</p>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="4.50"
                className="form-input"
                type="number"
                min={0}
              />
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onClose} className="form-cancel">
              Cancel
            </button>
            <button type="submit" className="form-accept" disabled={isSubmitting}>
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
