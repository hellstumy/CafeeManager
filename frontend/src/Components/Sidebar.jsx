import './Sidebar.css'
import logo from '../assets/icons/logo.svg'
import dashboard from '../assets/icons/dashboard.svg'
import menu from '../assets/icons/menu.svg'
import orders from '../assets/icons/orders.svg'
import qrcode from '../assets/icons/qrcode.svg'
import restaurants from '../assets/icons/Restaurants.svg'

export default function Sidebar() {
  return (
    <aside>
      <div className="aside_head">
        <img src={logo} alt="" />
        <h3>TableKit</h3>
      </div>
      <nav>
        <ul className="nav_ul">
          <button className="nav_btn nav_active">
            <img src={dashboard} alt="" />
            Dashboard
          </button>
          <button className="nav_btn">
            <img src={restaurants} alt="" />
            Restaurants
          </button>
        </ul>
        <ul className="nav_ul">
          Restaurant
          <button className="nav_btn">
            <img src={menu} alt="" />
            Menu
          </button>
          <button className="nav_btn">
            <img src={qrcode} alt="" />
            Tables
          </button>
          <button className="nav_btn">
            <img src={orders} alt="" />
            Orders
          </button>
        </ul>
      </nav>
      <div className="aside_profile">
        <img src={menu} alt="" />
        <div className="aside_info">
          <p className="aside_name">John Doe</p>
          <p className="aside_mail">mail@mail.com</p>
        </div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
              stroke="#94A3B8"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.6667 11.3334L14.0001 8.00008L10.6667 4.66675"
              stroke="#94A3B8"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 8H6"
              stroke="#94A3B8"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  )
}
