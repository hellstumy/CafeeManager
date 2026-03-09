import { useEffect, useMemo, useState } from 'react'
import Loader from '../../Components/Loader'
import { getRestaurant, updateRestaurant } from '../../api/api'
import { usePages, useSelectedRest } from '../../store/store'
import '../../Components/Modals/Modal.css'
import { useTranslation } from 'react-i18next'
import useNotification from '../../context/useNotification'

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

const toInputTime = (time) => {
  if (!time) return ''
  const [hour, minute] = String(time).split(':')
  return `${String(Number(hour)).padStart(2, '0')}:${minute}`
}

const formatHour = (time) => {
  if (!time) return ''
  const [hour, minute] = String(time).split(':')
  return `${Number(hour)}:${minute}`
}

const normalizeWorkingHours = (rawHours) => {
  const parsed =
    typeof rawHours === 'string'
      ? (() => {
          try {
            return JSON.parse(rawHours)
          } catch {
            return null
          }
        })()
      : rawHours

  const initial = getInitialHours()
  if (!parsed || typeof parsed !== 'object') return initial

  DAYS.forEach(({ key }) => {
    const value = parsed[key]
    if (!value) return

    if (typeof value === 'string' && value.trim().toLowerCase() === 'closed') {
      initial[key] = { ...initial[key], closed: true }
      return
    }

    if (typeof value === 'string') {
      const [open, close] = value.split('-')
      if (open && close) {
        initial[key] = {
          open: toInputTime(open),
          close: toInputTime(close),
          closed: false,
        }
      }
    }
  })

  return initial
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

export default function EditRestaurant() {
  const { t } = useTranslation()
  const { notifyBad } = useNotification()
  const selectedRest = useSelectedRest((state) => state.selectedRest)
  const setSelectPage = usePages((state) => state.setSelectPage)
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [workingHours, setWorkingHours] = useState(getInitialHours)

  useEffect(() => {
    getRestaurant()
      .then((data) => setRestaurants(data))
      .finally(() => setIsLoading(false))
  }, [])

  const restaurant = useMemo(
    () => restaurants.find((r) => r.id === selectedRest),
    [restaurants, selectedRest]
  )

  useEffect(() => {
    if (!restaurant) return

    setName(restaurant.name || '')
    setDescription(restaurant.description || '')
    setLogoUrl(restaurant.logo_url || '')
    setAddress(restaurant.address || '')
    setPhone(restaurant.phone || '')
    setWorkingHours(normalizeWorkingHours(restaurant.working_hours))
  }, [restaurant])

  const handleHoursChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRest) return

    setIsSubmitting(true)
    try {
      await updateRestaurant(selectedRest, {
        name,
        description,
        logo_url: logoUrl,
        address,
        phone,
        working_hours: buildWorkingHours(workingHours),
      })
      setSelectPage('restaurants')
    } catch (err) {
      console.log(err)
      notifyBad(t('main.editRestaurant.failedToUpdate'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <Loader label={t('main.editRestaurant.loading')} />
  }

  if (!selectedRest || !restaurant) {
    return (
      <div className="edit-restaurant-page">
        <div className="edit-restaurant-header">
          <h1>{t('main.editRestaurant.title')}</h1>
          <button onClick={() => setSelectPage('restaurants')}>
            {t('main.editRestaurant.back')}
          </button>
        </div>
        <p className="subtitle">{t('main.editRestaurant.notSelected')}</p>
      </div>
    )
  }

  return (
    <div className="edit-restaurant-page">
      <div className="edit-restaurant-header">
        <div>
          <h1>{t('main.editRestaurant.title')}</h1>
          <p className="subtitle">{t('main.editRestaurant.subtitle')}</p>
        </div>
        <button
          className="edit-restaurant-back"
          onClick={() => setSelectPage('restaurants')}
          type="button"
        >
          {t('main.editRestaurant.back')}
        </button>
      </div>

      <form className="edit-restaurant-form" onSubmit={handleSubmit}>
        <label>
          <p className="form-p">{t('main.editRestaurant.restaurantName')}</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            type="text"
            required
          />
        </label>

        <label>
          <p className="form-p">{t('main.editRestaurant.description')}</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textArea"
            required
          />
        </label>

        <label>
          <p className="form-p">{t('main.editRestaurant.logoUrl')}</p>
          <input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="form-input"
            type="text"
          />
        </label>

        <label>
          <p className="form-p">{t('main.editRestaurant.address')}</p>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
            type="text"
            required
          />
        </label>

        <label>
          <p className="form-p">{t('main.editRestaurant.phone')}</p>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input"
            type="text"
            required
          />
        </label>

        <div className="working-hours">
          <p className="form-p">{t('main.editRestaurant.workingHours')}</p>
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
          <button
            type="button"
            className="form-cancel"
            onClick={() => setSelectPage('restaurants')}
          >
            {t('main.editRestaurant.cancel')}
          </button>
          <button type="submit" className="form-accept" disabled={isSubmitting}>
            {t('main.editRestaurant.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  )
}
