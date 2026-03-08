import { useEffect, useState } from 'react'
import RestCard from '../../Components/RestCard'
import AddRestaurantModal from '../../Components/Modals/AddRestaurantModal'
import { getRestaurant } from '../../api/api'
import RestLoader from '../../Ui/Skeleton/RestLoader'
import { useTranslation } from 'react-i18next'

export default function Restaurants() {
  const { t } = useTranslation()
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRestaurants = () => {
    setIsLoading(true)
    getRestaurant().then((data) => {
      setRestaurants(data || [])
    }).finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const handleRestaurantCreated = (restaurant) => {
    if (restaurant) {
      setRestaurants((prev) => [...prev, restaurant])
      return
    }

    fetchRestaurants()
  }

  const handleRestaurantDeleted = (restaurantId) => {
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== restaurantId))
  }

  return (
    <div className="restaurants-page">
      <div className="restaurant_title">
        <h1>{t('main.restaurants.title')}</h1>
        <button onClick={() => setIsAddItemOpen(true)}>
          {t('main.restaurants.addRestaurant')}
        </button>
      </div>
      <p className="subtitle">{t('main.restaurants.subtitle')}</p>
      <div className="restaurants_list">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <RestLoader key={index} />)
        ) : restaurants.length > 0 ? (
          restaurants.map((r) => (
            <RestCard key={r.id} onDeleted={handleRestaurantDeleted} r={r} />
          ))
        ) : (
          <p className="subtitle">{t('main.restaurants.empty')}</p>
        )}
      </div>
      <AddRestaurantModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onCreated={handleRestaurantCreated}
      />
    </div>
  )
}
