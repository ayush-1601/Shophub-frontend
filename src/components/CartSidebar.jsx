import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/filters'

function CartSidebar() {
  const {
    cartItems,
    cartTotal,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()
  const [checkoutMessage, setCheckoutMessage] = useState('')

  function handleClose() {
    setCheckoutMessage('')
    closeCart()
  }

  useEffect(() => {
    if (!isCartOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setCheckoutMessage('')
        closeCart()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCartOpen, closeCart])

  function handleCheckout() {
    setCheckoutMessage('Checkout is not available in this demo.')
  }

  return (
    <>
      <div
        className={isCartOpen ? 'cart-backdrop is-open' : 'cart-backdrop'}
        onClick={handleClose}
        aria-hidden={!isCartOpen}
      />

      <aside
        className={isCartOpen ? 'cart-sidebar is-open' : 'cart-sidebar'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-hidden={!isCartOpen}
        inert={isCartOpen ? undefined : ''}
      >
        <div className="cart-sidebar__header">
          <h2 id="cart-title">Your Cart</h2>
          <button
            type="button"
            className="cart-close"
            onClick={handleClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty__icon" aria-hidden="true">
              🛒
            </p>
            <p className="status-panel__title">Your cart is empty.</p>
            <p className="muted">Add products to your cart to see them here.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} />
                    ) : (
                      <div className="image-fallback">No image</div>
                    )}
                  </div>

                  <div className="cart-item__info">
                    <h3>{item.title}</h3>
                    <p className="cart-item__price">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>

                    <div className="cart-item__actions">
                      <div className="qty-controls">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          −
                        </button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="text-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <p className="cart-subtotal">
                Subtotal: {formatPrice(cartTotal)}
              </p>
              <button type="button" className="button cart-checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              {checkoutMessage ? (
                <p className="field-error" role="status">
                  {checkoutMessage}
                </p>
              ) : null}
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartSidebar
