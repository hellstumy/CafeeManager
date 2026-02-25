import { useEffect, useRef, useState } from 'react'
import Restaurant from '../assets/icons/Restaurants.svg'
import { usePages, useSelectedRest } from '../store/store'
export default function RestCard({ r }) {
  const setSelectedRest = useSelectedRest((state) => state.setSelectedRest)
  const setSelectPage = usePages((state) => state.setSelectPage)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const openMenu = async () => {
    await setSelectedRest(r.id)
    await setSelectPage('menu')
  }
  const openOrders = async () => {
    await setSelectedRest(r.id)
    await setSelectPage('orders')
  }
  return (
    <div className="restaurant_card">
      <div className="rest_card-head">
        <img src={Restaurant} alt="" />

        <div className="rest-settings" ref={settingsRef}>
          <button
            type="button"
            aria-label="Additional settings"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
          >
            &#8942;
          </button>
          {isSettingsOpen && (
            <div className="rest-card-subsetting">
              <button type="button" onClick={() => setIsSettingsOpen(false)}>
                Settings
              </button>
              <button type="button" onClick={() => setIsSettingsOpen(false)}>
                Edit Menu
              </button>
              <button type="button" onClick={() => setIsSettingsOpen(false)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="restaurant-name">{r.name}</h3>
      <p className="rest_info-p">{r.description}</p>
      <div>
        <p className="rest_info-p">{r.address}</p>
        <p className="rest_info-p">{r.phone}</p>
      </div>
      <div className="rest-stats">
        <p className="rest_info-p">
          Tables: <span>5</span>
        </p>
        <p className="rest_info-p">
          Menu Items: <span>10</span>
        </p>
      </div>
      <div className="rest-buttons">
        <button onClick={() => openMenu()} className="rest-btn">
          Menu
        </button>
        <button onClick={() => openOrders()} className="rest-btn">
          Orders
        </button>
      </div>
    </div>
  )
}
