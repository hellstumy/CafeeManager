import cart from '../../assets/icons/cart.svg'
import ClientCard from '../../Components/ClientCard'

export default function ClientMenu({ onOpenCart }) {
  return (
    <div className="client-menu">
      <header className="client-header">
        <div className="client-head-title">
          <h2 className="client-title">Downtown Bistro</h2>
          <button className="cart-btn" onClick={onOpenCart} type="button">
            <img src={cart} alt="cart" />
          </button>
        </div>
        <ul className="client-filter">
          <li className="client-li client-active">All</li>
          <li className="client-li">Coffee</li>
          <li className="client-li">Breakfast</li>
          <li className="client-li">Lunch</li>
          <li className="client-li">Desserts</li>
        </ul>
      </header>
      <div className="client-menu_list">
        <ClientCard />
        <ClientCard />
      </div>
    </div>
  )
}
