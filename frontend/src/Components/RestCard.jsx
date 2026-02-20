import { useEffect, useRef, useState } from 'react'
import Restaurant from '../assets/icons/Restaurants.svg'
export default function RestCard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const settingsRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      <h3 className="restaurant-name">Downtown Bistro</h3>
      <p className="rest_info-p">Modern bistro with European cuisine</p>
      <div>
        <p className="rest_info-p">123 Main St, City</p>
        <p className="rest_info-p">+1 (555) 123-4567</p>
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
        <button className="rest-btn">Menu</button>
        <button className="rest-btn">Orders</button>
      </div>
    </div>
  )
}
