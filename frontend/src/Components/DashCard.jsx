import restaurants from '../assets/icons/Restaurants.svg'
export default function DashCard() {
  return (
    <div className="dashboard_restaurants-card">
      <div className="dr_img">
        <img src={restaurants} alt="" />
      </div>
      <h3>Downtown Bistro</h3>
      <div className="dash_restaurant-info">
        <p>
          Active Orders <span>12</span>
        </p>
        <p>
          Tables Occupied <span>8</span>
        </p>
      </div>
    </div>
  )
}
