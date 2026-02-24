import { useState } from 'react'
import Cart from '../Subpages/Client/Cart'
import ClientMenu from '../Subpages/Client/ClientMenu'

export default function ClientPage() {
  const [isCartOpen, setIsCartOpen] = useState(true)

  return (
    <div className="client-page">
      {isCartOpen ? (
        <Cart onBackToMenu={() => setIsCartOpen(false)} />
      ) : (
        <ClientMenu onOpenCart={() => setIsCartOpen(true)} />
      )}
    </div>
  )
}
