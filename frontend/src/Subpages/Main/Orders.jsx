import { useEffect, useMemo, useRef, useState } from 'react'
import { createSwapy } from 'swapy'
import OrderItem from '../../Components/OrderItem'
import { getOrders, updateOrderStatus, deleteOrder } from '../../api/api'
import { useSelectedRest } from '../../store/store'

const COLUMNS = [
  { id: 'pending', title: 'Pending' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'completed', title: 'Completed' },
]

export default function Order() {
  const swapy = useRef(null)
  const container = useRef(null)
  const [slotItemMap, setSlotItemMap] = useState([])
  const [orders, setOrders] = useState([])
  const selectedRest = useSelectedRest((state) => state.selectedRest)

  const orderById = useMemo(
    () =>
      Object.fromEntries(
        orders.map((order) => [String(order.order_id), order])
      ),
    [orders]
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
    getOrders(selectedRest).then((data) => {
      setOrders(data.orders)

      const initial = COLUMNS.flatMap((column) => {
        const columnOrders = data.orders.filter(
          (order) => order.status === column.id
        )
        const slots = columnOrders.map((order, index) => ({
          slot: `${column.id}-${index}`,
          item: String(order.order_id),
        }))
        slots.push({ slot: `${column.id}-${columnOrders.length}`, item: '' })
        return slots
      })

      setSlotItemMap(initial)
    })
  }, [selectedRest])

  const totalOrders = useMemo(
    () => slotItemMap.filter((entry) => Boolean(entry.item)).length,
    [slotItemMap]
  )

  async function handleDelete(orderId) {
    await deleteOrder(orderId)
    setSlotItemMap((prev) =>
      prev.map((entry) =>
        entry.item === orderId ? { ...entry, item: '' } : entry
      )
    )
  }

  useEffect(() => {
    if (container.current && slotItemMap.length > 0) {
      swapy.current = createSwapy(container.current, {
        swapMode: 'drop',
        manualSwap: true,
      })

      swapy.current.onSwap((event) => {
        const newMap = normalizeSlotItemMap(event.newSlotItemMap.asArray)

        newMap.forEach((entry) => {
          if (!entry.item) return
          const column = COLUMNS.find((col) =>
            entry.slot.startsWith(`${col.id}-`)
          )
          if (column) {
            updateOrderStatus(entry.item, column.id)
          }
        })

        setSlotItemMap(newMap)
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
          <button
            onClick={() =>
              getOrders(selectedRest).then((data) => {
                setOrders(data.orders)
                const refreshed = COLUMNS.flatMap((column) => {
                  const columnOrders = data.orders.filter(
                    (order) => order.status === column.id
                  )
                  const slots = columnOrders.map((order, index) => ({
                    slot: `${column.id}-${index}`,
                    item: String(order.order_id),
                  }))
                  slots.push({
                    slot: `${column.id}-${columnOrders.length}`,
                    item: '',
                  })
                  return slots
                })
                setSlotItemMap(refreshed)
              })
            }
          >
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
                        <div
                          className="order-item"
                          data-swapy-item={order.order_id}
                        >
                          <OrderItem order={order} onDelete={handleDelete} />
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
