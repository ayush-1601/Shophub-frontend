import { Navigate, Route, Routes } from 'react-router-dom'
import CartSidebar from './components/CartSidebar'
import Header from './components/Header'
import { CartProvider, useCart } from './context/CartContext'
import ProductDetail from './pages/ProductDetail'
import ProductListing from './pages/ProductListing'

function CartFeedback() {
  const { feedback } = useCart()

  if (!feedback) {
    return null
  }

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      {feedback}
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <div className="app-shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/product" replace />} />
            <Route path="/product" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/product" replace />} />
          </Routes>
        </main>
        <CartSidebar />
        <CartFeedback />
      </div>
    </CartProvider>
  )
}

export default App
