import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CART_STORAGE_KEY = 'ecommerce-cart'
const CartContext = createContext(null)

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return []
    }

    return normalizeCart(JSON.parse(raw))
  } catch {
    return []
  }
}

function normalizeCart(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (!item || item.id == null) {
        return null
      }

      const quantity = Number.parseInt(item.quantity, 10)
      const price = Number(item.price)

      if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price)) {
        return null
      }

      return {
        id: item.id,
        title: String(item.title || 'Product'),
        price,
        thumbnail: typeof item.thumbnail === 'string' ? item.thumbnail : '',
        quantity,
      }
    })
    .filter(Boolean)
}

function toCartItem(product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail || product.images?.[0] || '',
    quantity: 1,
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setFeedback(''), 1800)
    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  const addToCart = useCallback((product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id)

      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...items, toCartItem(product)]
    })
    setFeedback('Added to cart')
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId))
  }, [])

  const increaseQuantity = useCallback((productId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }, [])

  const decreaseQuantity = useCallback((productId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartItemCount,
      cartTotal,
      isCartOpen,
      feedback,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      cartItems,
      cartItemCount,
      cartTotal,
      isCartOpen,
      feedback,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Context and hook are intentionally colocated for a small cart API.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
