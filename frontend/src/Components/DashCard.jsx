import restaurants from '../assets/icons/Restaurants.svg'
import { useSelectedRest } from '../store/store'
import { useTranslation } from 'react-i18next'

export default function DashCard({ r }) {
  const { t } = useTranslation()
  const setSelectedRest = useSelectedRest((state) => state.setSelectedRest)
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
          {t('main.dashboardPage.activeOrders')} <span>12</span>
        </p>
        <p>
          {t('main.restaurants.card.tables')} <span>8</span>
        </p>
      </div>
    </div>
  )
}
