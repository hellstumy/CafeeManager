import Sidebar from '../Components/Sidebar'
import { useState } from 'react'
import Dashboard from '../Subpages/Main/Dashboard'
import Restaurants from '../Subpages/Main/Restaurants'
import Menu from '../Subpages/Main/Menu'
import Tables from '../Subpages/Main/Tables'
import Orders from '../Subpages/Main/Orders'
import EditRestaurant from '../Subpages/Main/EditRestaurant'
import Profile from './Profile'
import { usePages } from '../store/store'
import { useTranslation } from 'react-i18next'

export default function Main() {
  const { t } = useTranslation()
  const selectPage = usePages((state) => state.selectPage)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <>
      <main>
        <Sidebar className={isSidebarOpen ? '' : 'sidebar-hidden'} />
        <div className="main_container">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            type="button"
          >
            {isSidebarOpen ? t('main.hideSidebar') : t('main.showSidebar')}
          </button>
          {selectPage === 'dashboard' && <Dashboard />}
          {selectPage === 'restaurants' && <Restaurants />}
          {selectPage === 'menu' && <Menu />}
          {selectPage === 'tables' && <Tables />}
          {selectPage === 'orders' && <Orders />}
          {selectPage === 'restaurant-edit' && <EditRestaurant />}
          {selectPage === 'profile' && <Profile />}
        </div>
      </main>
    </>
  )
}
