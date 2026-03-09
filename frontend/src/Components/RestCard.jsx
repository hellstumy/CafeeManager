import { useEffect, useRef, useState } from 'react'
import Restaurant from '../assets/icons/Restaurants.svg'
import { usePages, useSelectedRest } from '../store/store'
import { deleteRestaurant } from '../api/api'
import { useTranslation } from 'react-i18next'
import { getTables } from '../api/api'
import { getMenu } from '../api/api'
import useNotification from '../context/useNotification'

export default function RestCard({ r, onDeleted }) {
  const { t } = useTranslation()
  const { notifyBad } = useNotification()
  const [tables, setTables] = useState(null)
  const [menu, setMenu] = useState(null)
  const setSelectedRest = useSelectedRest((state) => state.setSelectedRest)
  const setSelectPage = usePages((state) => state.setSelectPage)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef(null)

  const getCount = (value) => {
    if (Array.isArray(value)) return value.length
    return value?.count ?? 0
  }

  useEffect(() => {
    getMenu(r.id).then((data) => {
      setMenu(data)
      console.log(data)
    })
    getTables(r.id).then((data) => {
      setTables(data)
    })
  }, [r.id])

  const handleDelete = async () => {
    try {
      await deleteRestaurant(r.id)
      onDeleted?.(r.id)
      setIsSettingsOpen(false)
    } catch (err) {
      console.log(err)
      notifyBad(t('alerts.restaurantDeleteFailed'))
    }
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const openMenu = async () => {
    await setSelectedRest(r.id)
    await setSelectPage('menu')
  }
  const openOrders = async () => {
    await setSelectedRest(r.id)
    await setSelectPage('orders')
  }
  const openEditRestaurant = async () => {
    await setSelectedRest(r.id)
    await setSelectPage('restaurant-edit')
    setIsSettingsOpen(false)
  }
  return (
    <div className="restaurant_card">
      <div className="rest_card-head">
        <img src={Restaurant} alt="" />

        <div className="rest-settings" ref={settingsRef}>
          <button
            type="button"
            aria-label={t('main.restaurants.card.additionalSettings')}
            onClick={() => setIsSettingsOpen((prev) => !prev)}
          >
            &#8942;
          </button>
          {isSettingsOpen && (
            <div className="rest-card-subsetting">
              <button type="button" onClick={() => openEditRestaurant()}>
                {t('main.restaurants.card.settings')}
              </button>
              <button type="button" onClick={() => openMenu()}>
                {t('main.restaurants.card.editMenu')}
              </button>
              <button type="button" onClick={handleDelete}>
                {t('main.restaurants.card.delete')}
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="restaurant-name">{r.name}</h3>
      <p className="rest_info-p">{r.description}</p>
      <div>
        <p className="rest_info-p">{r.address}</p>
        <p className="rest_info-p">{r.phone}</p>
      </div>
      <div className="rest-stats">
        <p className="rest_info-p">
          {t('main.restaurants.card.tables')}: <span>{getCount(tables)}</span>
        </p>
        <p className="rest_info-p">
          {t('main.restaurants.card.menuItems')}:{' '}
          <span>{menu?.total_items ?? 0}</span>
        </p>
      </div>
      <div className="rest-buttons">
        <button onClick={() => openMenu()} className="rest-btn">
          {t('main.restaurants.card.menu')}
        </button>
        <button onClick={() => openOrders()} className="rest-btn">
          {t('main.restaurants.card.orders')}
        </button>
      </div>
    </div>
  )
}
