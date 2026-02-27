import './Modal.css'
import { createCategory } from '../../api/api'
import { useState } from 'react'
import { useSelectedRest } from '../../store/store'

export default function AddCategoryModal({ isOpen, onClose }) {
  const [name, setName] = useState('')
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  if (!isOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      await createCategory({ restaurant_id: selectedRest, name })
      onClose()
      setName('')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add New Category</h2>
          <button onClick={onClose}>&#735;</button>
        </div>

        <form className="modal-form" onSubmit={handleCreate}>
          <label>
            <p className="form-p">Category Name</p>
            <input
              placeholder="e.g., Appetizers, Main Course"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="form-cancel">
              Cancel
            </button>
            <button className="form-accept">Create Category</button>
          </div>
        </form>
      </div>
    </div>
  )
}
