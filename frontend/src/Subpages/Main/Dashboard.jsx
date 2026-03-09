import '../../Styles/Dashboard.css'
import DashCard from '../../Components/DashCard'
import active from '../../assets/icons/active.svg'
import avg from '../../assets/icons/avg.svg'
import people from '../../assets/icons/people.svg'
import salary from '../../assets/icons/salary.svg'
import { getRestaurant } from '../../api/api'
import { useEffect, useState } from 'react'
import DashLoader from '../../Ui/Skeleton/DashLoader'
import { useTranslation } from 'react-i18next'
import { getStats } from '../../api/api'

export default function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getStats().then((data) => {
      setStats(data)
    })
  }, [])
  useEffect(() => {
    getRestaurant()
      .then((data) => {
        setRestaurants(data || [])
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="dashboard">
      <h1>{t('main.dashboardPage.title')}</h1>
      <p className="subtitle">{t('main.dashboardPage.subtitle')}</p>
      <div className="dash_info">
        <div className="dash_card">
          <div>
            <p className="dash-name">{t('main.dashboardPage.restaurants')}</p>
            <img src={active} alt="" />
          </div>
          <p className="dash-value">{stats.restaurants}</p>
          <p className="dash_comparison">
            {/* <span>+12%</span> {t('main.dashboardPage.vsLastWeek')} */}
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">{t('main.dashboardPage.activeOrders')}</p>
            <img src={people} alt="" />
          </div>
          <p className="dash-value">{stats.activeOrders}</p>
          <p className="dash_comparison">
            {/* <span>+56%</span> {t('main.dashboardPage.vsLastWeek')} */}
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">{t('main.dashboardPage.todayRevenue')}</p>
            <img src={salary} alt="" />
          </div>
          <p className="dash-value">${stats.todayRevenue}</p>
          <p className="dash_comparison">
            {/* <span>+12%</span> {t('main.dashboardPage.vsLastWeek')} */}
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">{t('main.dashboardPage.todayOrders')}</p>
            <img src={avg} alt="" />
          </div>
          <p className="dash-value">{stats.todayOrders}</p>
          <p className="dash_comparison">
            {/* <span>+12%</span> {t('main.dashboardPage.vsLastWeek')} */}
          </p>
        </div>
      </div>
      <div className="dashboard_restaurants">
        <div className="dash_rest-title">
          <h2>{t('main.dashboardPage.yourRestaurants')}</h2>
        </div>
        <div className="dashboard_restaurants-cards">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <DashLoader key={index} />
            ))
          ) : restaurants.length > 0 ? (
            restaurants.map((r) => <DashCard key={r.id} r={r} />)
          ) : (
            <p className="subtitle">{t('main.restaurants.empty')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
