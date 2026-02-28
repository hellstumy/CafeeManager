import Sidebar from '../Components/Sidebar'
import Dashboard from '../Subpages/Main/Dashboard'
import Restaurants from '../Subpages/Main/Restaurants'
import Menu from '../Subpages/Main/Menu'
import Tables from '../Subpages/Main/Tables'
import Orders from '../Subpages/Main/Orders'
import EditRestaurant from '../Subpages/Main/EditRestaurant'
import { usePages } from '../store/store'

export default function Main() {
  const selectPage = usePages((state) => state.selectPage)
  return (
    <>
      <main>
        <Sidebar />
        <div className="main_container">
          {selectPage === 'dashboard' && <Dashboard />}
          {selectPage === 'restaurants' && <Restaurants />}
          {selectPage === 'menu' && <Menu />}
          {selectPage === 'tables' && <Tables />}
          {selectPage === 'orders' && <Orders />}
          {selectPage === 'restaurant-edit' && <EditRestaurant />}
        </div>
      </main>
    </>
  )
}
