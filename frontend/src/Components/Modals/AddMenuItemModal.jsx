import './Modal.css'

export default function AddMenuItemModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add Menu Item</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form">
          <label>
            <p className="form-p">Item Name</p>
            <input
              placeholder="Cappuccino"
              className="form-input"
              type="text"
            />
          </label>
          <label>
            <p className="form-p">Description</p>
            <input
              placeholder="Brief description of the item"
              className="form-input"
              type="text"
            />
          </label>
          <div className="form-cont">
            <label>
              <p className="form-p">Price</p>
              <input placeholder="4.50" className="form-input" type="number" />
            </label>
            <select className="form-select">
              <option value="Coffee">Coffee</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
            </select>
          </div>
        </form>
        <div className="form-buttons">
          <button className="form-cancel">Cancel</button>
          <button className="form-accept">Create Restaurant</button>
        </div>
      </div>
    </div>
  )
}
