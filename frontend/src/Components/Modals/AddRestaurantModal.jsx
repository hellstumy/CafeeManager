import { useState } from 'react'
import { createRestaurant } from '../../api/api'
import './Modal.css'
import { useTranslation } from 'react-i18next'

const DAYS = [
  { key: 'monday' },
  { key: 'tuesday' },
  { key: 'wednesday' },
  { key: 'thursday' },
  { key: 'friday' },
  { key: 'saturday' },
  { key: 'sunday' },
]

const getInitialHours = () => ({
  monday: { open: '09:00', close: '22:00', closed: false },
  tuesday: { open: '09:00', close: '22:00', closed: false },
  wednesday: { open: '09:00', close: '22:00', closed: false },
  thursday: { open: '09:00', close: '22:00', closed: false },
  friday: { open: '09:00', close: '23:00', closed: false },
  saturday: { open: '10:00', close: '23:00', closed: false },
  sunday: { open: '10:00', close: '22:00', closed: true },
})

const formatHour = (time) => {
  if (!time) return ''
  const [hour, minute] = time.split(':')
  return `${Number(hour)}:${minute}`
}

const buildWorkingHours = (hours) =>
  Object.fromEntries(
    Object.entries(hours).map(([day, value]) => [
      day,
      value.closed
        ? 'Closed'
        : `${formatHour(value.open)}-${formatHour(value.close)}`,
    ])
  )

export default function AddRestaurantModal({ isOpen, onClose, onCreated }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [workingHours, setWorkingHours] = useState(getInitialHours)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleHoursChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setLogoUrl('')
    setAddress('')
    setPhone('')
    setWorkingHours(getInitialHours())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const createdRestaurant = await createRestaurant({
        name,
        description,
        logo_url: logoUrl,
        address,
        phone,
        working_hours: buildWorkingHours(workingHours),
      })

      onCreated?.(createdRestaurant)
      resetForm()
      onClose()
    } catch (err) {
      console.log(err)
      alert(t('alerts.createRestaurantFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h2>{t('modals.addRestaurant.title')}</h2>
          <button onClick={onClose}>&#735;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            <p className="form-p">{t('modals.addRestaurant.name')}</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('modals.addRestaurant.namePlaceholder')}
              className="form-input"
              type="text"
              required
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addRestaurant.description')}</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('modals.addRestaurant.descriptionPlaceholder')}
              className="form-textArea"
              required
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addRestaurant.logoUrl')}</p>
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder={t('modals.addRestaurant.logoPlaceholder')}
              className="form-input"
              type="text"
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addRestaurant.address')}</p>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('modals.addRestaurant.addressPlaceholder')}
              className="form-input"
              type="text"
              required
            />
          </label>

          <label>
            <p className="form-p">{t('modals.addRestaurant.phone')}</p>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('modals.addRestaurant.phonePlaceholder')}
              className="form-input"
              type="text"
              required
            />
          </label>

          <div className="working-hours">
            <p className="form-p">{t('modals.addRestaurant.workingHours')}</p>
            {DAYS.map(({ key }) => (
              <div className="day-hours" key={key}>
                <span className="day-name">{t(`main.editRestaurant.days.${key}`)}</span>
                <input
                  type="time"
                  className="form-input time-input"
                  value={workingHours[key].open}
                  disabled={workingHours[key].closed}
                  onChange={(e) => handleHoursChange(key, 'open', e.target.value)}
                />
                <input
                  type="time"
                  className="form-input time-input"
                  value={workingHours[key].close}
                  disabled={workingHours[key].closed}
                  onChange={(e) => handleHoursChange(key, 'close', e.target.value)}
                />
                <label className="closed-label">
                  <input
                    type="checkbox"
                    checked={workingHours[key].closed}
                    onChange={(e) =>
                      handleHoursChange(key, 'closed', e.target.checked)
                    }
                  />
                  {t('main.editRestaurant.days.closed')}
                </label>
              </div>
            ))}
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="form-cancel">
              {t('modals.common.cancel')}
            </button>
            <button type="submit" className="form-accept" disabled={isSubmitting}>
              {t('modals.addRestaurant.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
