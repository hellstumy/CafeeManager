import './Sidebar.css'
import logo from '../assets/icons/logo.svg'
import dashboard from '../assets/icons/dashboard.svg'
import menu from '../assets/icons/menu.svg'
import orders from '../assets/icons/orders.svg'
import qrcode from '../assets/icons/qrcode.svg'
import restaurants from '../assets/icons/Restaurants.svg'
import { usePages, useSelectedRest } from '../store/store'
import { logout } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const selectPage = usePages((state) => state.selectPage)
  const setSelectPage = usePages((state) => state.setSelectPage)
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  const navigate = useNavigate()
  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <aside>
      <div className="aside_head">
        <img src={logo} alt="" />
        <h3>TableKit</h3>
      </div>
      <nav>
        <ul className="nav_ul">
          <button
            onClick={() => setSelectPage('dashboard')}
            className={`nav_btn ${selectPage === 'dashboard' ? 'nav_active' : ''}`}
          >
            <img src={dashboard} alt="" />
            Dashboard
          </button>
          <button
            onClick={() => setSelectPage('restaurants')}
            className={`nav_btn ${selectPage === 'restaurants' ? 'nav_active' : ''}`}
          >
            <img src={restaurants} alt="" />
            Restaurants
          </button>
        </ul>
        <ul
          style={selectedRest === null ? { display: 'none' } : {}}
          className="nav_ul"
        >
          Restaurant
          <button
            onClick={() => setSelectPage('menu')}
            className={`nav_btn ${selectPage === 'menu' ? 'nav_active' : ''}`}
          >
            <img src={menu} alt="" />
            Menu
          </button>
          <button
            onClick={() => setSelectPage('tables')}
            className={`nav_btn ${selectPage === 'tables' ? 'nav_active' : ''}`}
          >
            <img src={qrcode} alt="" />
            Tables
          </button>
          <button
            onClick={() => setSelectPage('orders')}
            className={`nav_btn ${selectPage === 'orders' ? 'nav_active' : ''}`}
          >
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
        <button onClick={() => handleLogout()}>
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
