import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function OrderItem({ order, onDelete }) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    await onDelete(String(order.order_id))
    setIsDeleting(false)
  }

  return (
    <>
      <h3 className="order-item_num">#{order.order_id}</h3>
      <p className="order-info_p">
        {t('main.ordersPage.table')} {order.table_number}
      </p>
      <div className="order_items">
        {order.items.map((item) => (
          <p className="order-info_p" key={item.id}>
            {item.quantity}x {item.menu_item_name}
            {item.notes && <span> — {item.notes}</span>}
          </p>
        ))}
      </div>
      <div className="order-price">
        <p>${order.total_amount}</p>
        <button
          type="button"
          data-swapy-no-drag
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : t('main.ordersPage.delete')}
        </button>
      </div>
    </>
  )
}
