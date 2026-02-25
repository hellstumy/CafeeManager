import restaurants from '../assets/icons/Restaurants.svg'
import { useSelectedRest } from '../store/store'

export default function DashCard({ r }) {
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
          Active Orders <span>12</span>
        </p>
        <p>
          Tables <span>8</span>
        </p>
      </div>
    </div>
  )
}
