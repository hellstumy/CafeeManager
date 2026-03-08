import { useState } from 'react'
import { useSelectedRest } from '../../store/store'
import './Modal.css'
import { createTable } from '../../api/api'
import { useTranslation } from 'react-i18next'

export default function AddTableModal({ isOpen, onClose, onCreated }) {
  const { t } = useTranslation()
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  const [table_number, setTableNumber] = useState('')
  const [seats, setSeats] = useState('')
  if (!isOpen) return null
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const created = await createTable({
        restaurant_id: selectedRest,
        table_number,
        seats,
      })
      onCreated?.(created?.table || null)
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
          <h2>{t('modals.addTable.title')}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>
        <form className="modal-form" onSubmit={handleCreate}>
          <label>
            <p className="form-p">{t('modals.addTable.tableNumber')}</p>
            <input
              value={table_number}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder={t('modals.addTable.tablePlaceholder')}
              className="form-input"
              type="text"
            />
          </label>
          <label>
            <p className="form-p">{t('modals.addTable.seats')}</p>
            <input
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              placeholder={t('modals.addTable.seatsPlaceholder')}
              className="form-input"
              type="number"
              min={1}
            />
          </label>

          <div className="form-buttons">
            <button className="form-cancel" onClick={onClose} type="button">
              {t('modals.common.cancel')}
            </button>
            <button type="submit" className="form-accept">
              {t('modals.addTable.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
