import cart from '../../assets/icons/cart.svg'
import ClientCard from '../../Components/ClientCard'
import { useTranslation } from 'react-i18next'

export default function ClientMenu({
  client,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenCart,
  cartCount,
  onAddToCart,
}) {
  const { t } = useTranslation()
  const visibleCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter(
          (category) => String(category.id) === selectedCategory
        )

  return (
    <div className="client-menu">
      <header className="client-header">
        <div className="client-head-title">
          <h2 className="client-title">
            {t('client.table', { number: client.table_number })}
          </h2>
          <button className="cart-btn" onClick={onOpenCart} type="button">
            <img src={cart} alt={t('client.cartIconAlt')} />
            {!!cartCount && <span className="cart-count"> ({cartCount})</span>}
          </button>
        </div>
        <ul className="client-filter">
          <li
            className={`client-li ${selectedCategory === 'all' ? 'client-active' : ''}`}
            onClick={() => onSelectCategory('all')}
          >
            {t('client.all')}
          </li>
          {categories.map((category) => (
            <li
              className={`client-li ${selectedCategory === String(category.id) ? 'client-active' : ''}`}
              key={category.id}
              onClick={() => onSelectCategory(String(category.id))}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </header>
      <div className="client-menu_list">
        {visibleCategories.flatMap((category) =>
          category.items.map((item) => (
            <ClientCard
              categoryName={category.name}
              item={item}
              key={item.id}
              onAdd={onAddToCart}
            />
          ))
        )}
      </div>
    </div>
  )
}
