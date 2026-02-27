import { useState } from 'react'
import { useSelectedRest } from '../../store/store'
import './Modal.css'
import { createTable } from '../../api/api'
export default function AddTableModal({ isOpen, onClose }) {
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  const [table_number, setTableNumber] = useState()
  const [seats, setSeats] = useState()
  if (!isOpen) return null
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createTable({
        restaurant_id: selectedRest,
        table_number,
        seats,
      })
      setTableNumber('')
      setSeats('')
      onClose()
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>Add New Table</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form" onSubmit={handleCreate}>
          <label>
            <p className="form-p">Table Number</p>
            <input
              value={table_number}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="1A"
              className="form-input"
              type="text"
            />
          </label>
          <label>
            <p className="form-p">Number of Seats</p>
            <input
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              placeholder="4"
              className="form-input"
              type="number"
              min={1}
            />
          </label>

          <div className="form-buttons">
            <button className="form-cancel">Cancel</button>
            <button type="submit" className="form-accept">
              Create table
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
