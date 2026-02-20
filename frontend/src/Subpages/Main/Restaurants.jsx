import RestCard from '../../Components/RestCard'

export default function Restaurants() {
  return (
    <div className="restaurants-page">
      <div className="restaurant_title">
        <h1>Restaurants</h1>
        <button>Add Restaurant</button>
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
    </div>
  )
}
