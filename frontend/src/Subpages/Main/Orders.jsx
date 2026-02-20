import { useEffect, useMemo, useRef, useState } from 'react'
import { createSwapy } from 'swapy'
import OrderItem from '../../Components/OrderItem'

const COLUMNS = [
  { id: 'pending', title: 'Pending' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'completed', title: 'Completed' },
]

const ORDERS = [
  {
    id: 'order-1247',
    number: '#1247',
    table: 'Table 12',
    items: ['1x Croissant', '2x Cappuccino'],
    price: '$24.50',
  },
  {
    id: 'order-1248',
    number: '#1248',
    table: 'Table 4',
    items: ['1x Caesar Salad', '1x Latte'],
    price: '$18.00',
  },
  {
    id: 'order-1249',
    number: '#1249',
    table: 'Takeaway',
    items: ['2x Espresso', '1x Cheesecake'],
    price: '$14.50',
  },
  {
    id: 'order-1250',
    number: '#1250',
    table: 'Table 9',
    items: ['1x Pancakes', '1x Americano'],
    price: '$16.00',
  },
  {
    id: 'order-1251',
    number: '#1251',
    table: 'Table 2',
    items: ['1x Burger', '1x Cola'],
    price: '$21.00',
  },
]

const INITIAL_COLUMN_ITEMS = {
  pending: ['order-1247', 'order-1250'],
  inprogress: ['order-1248'],
  completed: ['order-1249', 'order-1251'],
}

export default function Order() {
  const swapy = useRef(null)
  const container = useRef(null)
  const [slotItemMap, setSlotItemMap] = useState([])

  const orderById = useMemo(
    () => Object.fromEntries(ORDERS.map((order) => [order.id, order])),
    []
  )

  function slotIndex(slotId) {
    return Number(slotId.split('-')[1] ?? 0)
  }

  function normalizeSlotItemMap(mapArray) {
    return COLUMNS.flatMap((column) => {
      const columnPrefix = `${column.id}-`
      const columnSlots = mapArray
        .filter((entry) => entry.slot.startsWith(columnPrefix))
        .sort((a, b) => slotIndex(a.slot) - slotIndex(b.slot))

      if (columnSlots.length === 0) {
        return [{ slot: `${column.id}-0`, item: '' }]
      }

      const normalized = []
      let hasEmpty = false

      columnSlots.forEach((entry) => {
        if (entry.item) {
          normalized.push(entry)
          return
        }
        if (!hasEmpty) {
          normalized.push({ ...entry, item: '' })
          hasEmpty = true
        }
      })

      if (!hasEmpty) {
        const nextIndex =
          Math.max(...columnSlots.map((entry) => slotIndex(entry.slot))) + 1
        normalized.push({ slot: `${column.id}-${nextIndex}`, item: '' })
      }

      return normalized
    })
  }

  useEffect(() => {
    const initial = COLUMNS.flatMap((column) => {
      const items = INITIAL_COLUMN_ITEMS[column.id] ?? []
      const slots = items.map((itemId, index) => ({
        slot: `${column.id}-${index}`,
        item: itemId,
      }))
      slots.push({ slot: `${column.id}-${items.length}`, item: '' })
      return slots
    })
    setSlotItemMap(initial)
  }, [])

  const totalOrders = useMemo(
    () => slotItemMap.filter((entry) => Boolean(entry.item)).length,
    [slotItemMap]
  )

  useEffect(() => {
    if (container.current && slotItemMap.length > 0) {
      swapy.current = createSwapy(container.current, {
        swapMode: 'drop',
        manualSwap: true,
      })

      swapy.current.onSwap((event) => {
        setSlotItemMap(normalizeSlotItemMap(event.newSlotItemMap.asArray))
      })
    }

    return () => {
      swapy.current?.destroy()
    }
  }, [slotItemMap.length])

  useEffect(() => {
    swapy.current?.update()
  }, [slotItemMap])

  return (
    <div className="order-page">
      <div className="order-header">
        <div className="order-title">
          <h1>Orders Board</h1>
          <p className="subtitle">Live order management</p>
        </div>
        <div className="order-buttons">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333"
                stroke="#F8FAFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.0001 2V5.33333H10.6667"
                stroke="#F8FAFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667"
                stroke="#F8FAFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.33333 10.6666H2V14"
                stroke="#F8FAFC"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Refresh
          </button>
          <span>{totalOrders} orders</span>
        </div>
      </div>
      <div className="order-main container" ref={container}>
        {COLUMNS.map((column) => (
          <div className="status-column" key={column.id}>
            <h4>{column.title}</h4>
            <div className="status-container">
              {slotItemMap
                .filter((entry) => entry.slot.startsWith(`${column.id}-`))
                .sort((a, b) => slotIndex(a.slot) - slotIndex(b.slot))
                .map(({ slot: slotId, item: orderId }) => {
                  const order = orderId ? orderById[orderId] : null
                  return (
                    <div
                      className="status-slot"
                      data-swapy-slot={slotId}
                      key={slotId}
                    >
                      {order && (
                        <div className="order-item" data-swapy-item={order.id}>
                          <OrderItem order={order} />
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
