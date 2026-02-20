export default function OrderItem({ order }) {
  return (
    <>
      <h3 className="order-item_num">{order.number}</h3>
      <p className="order-info_p">{order.table}</p>
      <div className="order_items">
        {order.items.map((item) => (
          <p className="order-info_p" key={item}>
            {item}
          </p>
        ))}
      </div>
      <div className="order-price">
        <p>{order.price}</p>
        <button type="button" data-swapy-no-drag>
          Delete
        </button>
      </div>
    </>
  )
}
