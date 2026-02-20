import DashCard from '../../Components/DashCard'
import active from '../../assets/icons/active.svg'
import avg from '../../assets/icons/avg.svg'
import people from '../../assets/icons/people.svg'
import salary from '../../assets/icons/salary.svg'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Overview of your restaurant operations</p>
      <div className="dash_info">
        <div className="dash_card">
          <div>
            <p className="dash-name">Active Orders</p>
            <img src={active} alt="" />
          </div>
          <p className="dash-value">24</p>
          <p className="dash_comparison">
            <span>+12%</span> vs last week
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">Tables Occupied</p>
            <img src={people} alt="" />
          </div>
          <p className="dash-value">18/32</p>
          <p className="dash_comparison">
            <span>+56%</span> vs last week
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">Revenue Today</p>
            <img src={salary} alt="" />
          </div>
          <p className="dash-value">$3,847</p>
          <p className="dash_comparison">
            <span>+12%</span> vs last week
          </p>
        </div>
        <div className="dash_card">
          <div>
            <p className="dash-name">Avg. Order Value</p>
            <img src={avg} alt="" />
          </div>
          <p className="dash-value">$42.50</p>
          <p className="dash_comparison">
            <span>+12%</span> vs last week
          </p>
        </div>
      </div>
      <div className="dashboard_restaurants">
        <div className="dash_rest-title">
          <h2>Your Restaurants</h2>
          <button>Add Restaurant</button>
        </div>
        <div className="dashboard_restaurants-cards">
          <DashCard />
          <DashCard />
          <DashCard />
        </div>
      </div>
    </div>
  )
}
