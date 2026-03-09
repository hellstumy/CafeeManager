import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import Cart from '../Subpages/Client/Cart'
import ClientMenu from '../Subpages/Client/ClientMenu'
import { createPublicOrder, getMenu, getOneTable } from '../api/api'
import { useTranslation } from 'react-i18next'
import useNotification from '../context/useNotification'

export default function ClientPage() {
  const { t } = useTranslation()
  const { notifyGood } = useNotification()
  const { qrToken } = useParams()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [client, setClient] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cartItems, setCartItems] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  useEffect(() => {
    if (!qrToken) {
      setError(t('client.qrTokenMissing'))
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // 1️⃣ Получаем стол
        const clientData = await getOneTable(qrToken)

        if (!clientData) {
          throw new Error(t('client.tableNotFound'))
        }

        setClient(clientData)

        // 2️⃣ Получаем меню ресторана
        if (clientData.restaurant_id) {
          const menuData = await getMenu(clientData.restaurant_id)
          setCategories(menuData?.categories || [])
        } else {
          throw new Error(t('client.tableWithoutRestaurant'))
        }
      } catch (err) {
        console.error(err)
        setError(err.message || t('client.dataLoadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [qrToken, t])

  const cartList = useMemo(() => Object.values(cartItems), [cartItems])
  const cartCount = useMemo(
    () => cartList.reduce((sum, item) => sum + item.quantity, 0),
    [cartList]
  )
  const subtotal = useMemo(
    () =>
      cartList.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartList]
  )
  const serviceFee = useMemo(() => (cartList.length > 0 ? 1.5 : 0), [cartList])
  const total = subtotal + serviceFee

  function handleAddToCart(menuItem) {
    setSubmitError(null)
    setSubmitSuccess(null)

    setCartItems((prev) => {
      const existing = prev[menuItem.id]
      if (existing) {
        return {
          ...prev,
          [menuItem.id]: {
            ...existing,
            quantity: existing.quantity + 1,
          },
        }
      }

      const parentCategory = categories.find((category) =>
        category.items.some((item) => item.id === menuItem.id)
      )

      return {
        ...prev,
        [menuItem.id]: {
          ...menuItem,
          id: menuItem.id,
          quantity: 1,
          note: '',
          categoryName: parentCategory?.name || t('client.otherCategory'),
        },
      }
    })
  }

  function handleRemoveFromCart(itemId) {
    setCartItems((prev) => {
      const updated = { ...prev }
      delete updated[itemId]
      return updated
    })
  }

  function handleUpdateQuantity(itemId, value) {
    const quantity = Math.max(1, Number.parseInt(value, 10) || 1)

    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity,
      },
    }))
  }

  function handleUpdateNote(itemId, note) {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        note,
      },
    }))
  }

  async function handleCheckout() {
    if (!client?.id || cartList.length === 0) return

    setIsSubmittingOrder(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      await createPublicOrder({
        table_id: client.id,
        items: cartList.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          notes: item.note || null,
        })),
        notes: null,
      })

      setCartItems({})
      setSubmitSuccess(t('client.orderCreated'))
      notifyGood(t('client.orderCreated'))
    } catch (err) {
      setSubmitError(err.message || t('client.orderCreateFailed'))
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="client-page">
        <Loader label={t('client.loadingMenu')} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="client-page">
        {t('client.errorPrefix')} {error}
      </div>
    )
  }

  if (!client) {
    return <div className="client-page">{t('client.dataNotFound')}</div>
  }

  return (
    <div className="client-page">
      {isCartOpen ? (
        <Cart
          isSubmitting={isSubmittingOrder}
          items={cartList}
          onBackToMenu={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
          onRemoveItem={handleRemoveFromCart}
          onUpdateNote={handleUpdateNote}
          onUpdateQty={handleUpdateQuantity}
          serviceFee={serviceFee}
          submitError={submitError}
          submitSuccess={submitSuccess}
          subtotal={subtotal}
          total={total}
        />
      ) : (
        <ClientMenu
          client={client}
          cartCount={cartCount}
          categories={categories}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  )
}
