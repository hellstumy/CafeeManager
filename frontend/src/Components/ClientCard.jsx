import menuIMG from '../assets/menuIMG.png'
export default function ClientCard() {
  return (
    <div className="client-card">
      <img src={menuIMG} alt="" />
      <div className="client-card_info">
        <h3 className="client-card_title">
          Cappuccino <span>Coffee</span>
        </h3>
        <p className="client-card_description">
          Espresso with steamed milk and rich foam
        </p>
        <div className="client-card_other">
          <p className="clirnt-price">$4.50</p>
          <button className="add-Btn">Add</button>
        </div>
      </div>
    </div>
  )
}
