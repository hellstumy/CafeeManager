import { useSelectedRest } from '../../store/store'
import './Modal.css'
import { createMenuItem, getCategory } from '../../api/api'
import { useEffect, useState } from 'react'

export default function AddMenuItemModal({ isOpen, onClose }) {
  const [categories, setCategories] = useState([])
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [img_url, setImg_url] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (!selectedRest) return

    getCategory(selectedRest).then((data) => {
      setCategories(data)
    })
  }, [selectedRest])

  if (!isOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      await createMenuItem({
        restaurant_id: selectedRest,
        category_id: selectedCategory,
        name,
        description,
        img_url,
        price: Number(price),
      })

      setName('')
      setDescription('')
      setImg_url('')
      setPrice('')
      setSelectedCategory('')
      onClose()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add Menu Item</h2>
          <button onClick={onClose}>&#735;</button>
        </div>

        <form className="modal-form" onSubmit={handleCreate}>
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
                min={0}
                className="form-input"
                type="number"
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
            <button type="submit" className="form-accept">
              Create Menu Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
