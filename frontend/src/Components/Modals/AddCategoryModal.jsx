import './Modal.css'
import { createCategory } from '../../api/api'
import { useState } from 'react'
import { useSelectedRest } from '../../store/store'
import { useTranslation } from 'react-i18next'

export default function AddCategoryModal({ isOpen, onClose, onCreated }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  if (!isOpen) return null

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      const created = await createCategory({ restaurant_id: selectedRest, name })
      onCreated?.(created)
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
          <h2>{t('modals.addCategory.title')}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>

        <form className="modal-form" onSubmit={handleCreate}>
          <label>
            <p className="form-p">{t('modals.addCategory.name')}</p>
            <input
              placeholder={t('modals.addCategory.placeholder')}
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="form-cancel">
              {t('modals.common.cancel')}
            </button>
            <button className="form-accept">{t('modals.addCategory.create')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
