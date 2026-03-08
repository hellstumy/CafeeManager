import { useSelectedRest } from '../../store/store'
import './Modal.css'
import { createMenuItem, getCategory } from '../../api/api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AddMenuItemModal({ isOpen, onClose, onCreated }) {
  const { t } = useTranslation()
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
      const created = await createMenuItem({
        restaurant_id: selectedRest,
        category_id: selectedCategory,
        name,
        description,
        img_url,
        price: Number(price),
      })

      onCreated?.(created)
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
          <h2>{t('modals.addMenuItem.title')}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>

        <form className="modal-form" onSubmit={handleCreate}>
          <label>
            <p className="form-p">{t('modals.addMenuItem.name')}</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('modals.addMenuItem.namePlaceholder')}
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addMenuItem.description')}</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('modals.addMenuItem.descriptionPlaceholder')}
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addMenuItem.imageUrl')}</p>
            <input
              value={img_url}
              onChange={(e) => setImg_url(e.target.value)}
              placeholder={t('modals.addMenuItem.imagePlaceholder')}
              className="form-input"
              type="text"
            />
          </label>

          <div className="form-cont">
            <label>
              <p className="form-p">{t('modals.addMenuItem.price')}</p>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t('modals.addMenuItem.pricePlaceholder')}
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
              <option value="">{t('modals.common.selectCategory')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="form-cancel">
              {t('modals.common.cancel')}
            </button>
            <button type="submit" className="form-accept">
              {t('modals.addMenuItem.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
