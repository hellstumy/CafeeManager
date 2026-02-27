import { useEffect, useState } from 'react'
import RestCard from '../../Components/RestCard'
import AddRestaurantModal from '../../Components/Modals/AddRestaurantModal'
import { getRestaurant } from '../../api/api'
import RestLoader from '../../Ui/Skeleton/RestLoader'
export default function Restaurants() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => {
    getRestaurant().then((data) => {
      setRestaurants(data)
      console.log(data)
    })
  }, [])
  return (
    <div className="restaurants-page">
      <div className="restaurant_title">
        <h1>Restaurants</h1>
        <button onClick={() => setIsAddItemOpen(true)}>Add Restaurant</button>
      </div>
      <p className="subtitle">Manage your restaurant locations</p>
      <div className="restaurants_list">
        {restaurants.length === 0 ? (
          <RestLoader />
        ) : (
          restaurants.map((r) => <RestCard key={r.id} r={r} />)
        )}
      </div>
      <AddRestaurantModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />
    </div>
  )
}
