import './Modal.css'

export default function AddTableModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add New Table</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form">
          <label>
            <p className="form-p">Table Number</p>
            <input placeholder="1A" className="form-input" type="text" />
          </label>
          <label>
            <p className="form-p">Number of Seats</p>
            <input
              placeholder="4"
              className="form-input"
              type="number"
              min={1}
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
