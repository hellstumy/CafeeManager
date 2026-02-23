import { useState } from 'react'
import RestCard from '../../Components/RestCard'
import AddRestaurantModal from '../../Components/Modals/AddRestaurantModal'

export default function Restaurants() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  return (
    <div className="restaurants-page">
      <div className="restaurant_title">
        <h1>Restaurants</h1>
        <button onClick={() => setIsAddItemOpen(true)}>Add Restaurant</button>
      </div>
      <p className="subtitle">Manage your restaurant locations</p>
      <div className="restaurants_list">
        <RestCard />
        <RestCard />
        <RestCard />
        <RestCard />
        <RestCard />
        <RestCard />
      </div>
      <AddRestaurantModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />
    </div>
  )
}
