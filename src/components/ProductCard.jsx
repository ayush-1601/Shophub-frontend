import { Link } from 'react-router-dom'
import AddToCartButton from './AddToCartButton'
import { formatPrice } from '../utils/filters'

function ProductCard({ product }) {
  const imageSrc = product.thumbnail || product.images?.[0]
  const rating = Number(product.rating ?? 0).toFixed(1)

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__main">
        <div className="product-card__image">
          {imageSrc ? (
            <img src={imageSrc} alt={product.title} />
          ) : (
            <div className="image-fallback" aria-hidden="true">
              No image
            </div>
          )}
        </div>
        <div className="product-card__body">
          <h2 className="product-card__title">{product.title}</h2>
          <div className="product-card__meta">
            <p className="product-card__price">{formatPrice(product.price)}</p>
            <p className="product-card__rating" aria-label={`Rating ${rating} out of 5`}>
              <span aria-hidden="true">⭐</span> {rating}
            </p>
          </div>
        </div>
      </Link>
      <div className="product-card__footer">
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}

export default ProductCard
