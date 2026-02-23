import './Modal.css'

export default function AddCategoryModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add New Category</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form">
          <label>
            <p className="form-p">Category Name</p>
            <input
              placeholder="e.g., Appetizers, Main Course"
              className="form-input"
              type="text"
            />
          </label>
        </form>
        <div className="form-buttons">
          <button className="form-cancel">Cancel</button>
          <button className="form-accept">Create Restaurant</button>
        </div>
      </div>
    </div>
  )
}
