import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/CartContext'

function AddToCartButton({ product, className = '' }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    addToCart(product)
    setAdded(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <button
      type="button"
      className={`button add-to-cart ${added ? 'is-added' : ''} ${className}`.trim()}
      onClick={handleClick}
    >
      {added ? 'Added to Cart ✓' : 'Add to Cart'}
    </button>
  )
}

export default AddToCartButton
