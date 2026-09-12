import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const { cartItemCount, isCartOpen, openCart } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/product" className="site-logo">
          ShopHub
        </Link>

        <form
          className="site-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            placeholder="Search products"
            autoComplete="off"
          />
          <button type="submit" aria-label="Search">
            Search
          </button>
        </form>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-button cart-button"
            aria-label={`Shopping cart, ${cartItemCount} items`}
            aria-expanded={isCartOpen}
            aria-controls="cart-title"
            onClick={openCart}
          >
            <span className="cart-button__icon">
              <CartIcon />
              {cartItemCount > 0 ? (
                <span className="cart-badge">{cartItemCount}</span>
              ) : null}
            </span>
            <span className="icon-button__label">Cart</span>
          </button>
          <button type="button" className="icon-button" aria-label="User profile">
            <UserIcon />
            <span className="icon-button__label">Account</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7.16 14h11.45a1 1 0 0 0 .96-.74l1.82-7A1 1 0 0 0 20.43 5H6.21l-.35-1.6A1 1 0 0 0 4.89 2H2v2h2.11l2.4 10.84A2 2 0 0 0 7.16 16H19v-2H7.16Z"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
      />
    </svg>
  )
}

export default Header
