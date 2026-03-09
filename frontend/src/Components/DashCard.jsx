import restaurants from '../assets/icons/Restaurants.svg'
import { useSelectedRest } from '../store/store'
import { useTranslation } from 'react-i18next'
import { getTables } from '../api/api'
import { getOrders } from '../api/api'
import { useEffect, useState } from 'react'

export default function DashCard({ r }) {
  const { t } = useTranslation()
  const [orders, setOrders] = useState(null)
  const [tables, setTables] = useState(null)
  const setSelectedRest = useSelectedRest((state) => state.setSelectedRest)

  const getCount = (value) => {
    if (Array.isArray(value)) return value.length
    return value?.count ?? 0
  }

  useEffect(() => {
    getOrders(r.id).then((data) => {
      setOrders(data)
    })
    getTables(r.id).then((data) => {
      setTables(data)
    })
  }, [r.id])
  return (
    <div
      onClick={() => setSelectedRest(r.id)}
      className="dashboard_restaurants-card"
    >
      <div className="dr_img">
        <img src={restaurants} alt="" />
      </div>
      <h3>{r.name}</h3>
      <div className="dash_restaurant-info">
        <p>
          {t('main.dashboardPage.activeOrders')} <span>{getCount(orders)}</span>
        </p>
        <p>
          {t('main.restaurants.card.tables')} <span>{getCount(tables)}</span>
        </p>
      </div>
    </div>
  )
}
