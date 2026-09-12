import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddToCartButton from '../components/AddToCartButton'
import ErrorMessage from '../components/ErrorMessage'
import ProductDetailSkeleton from '../components/ProductDetailSkeleton'
import { useProduct } from '../hooks/useProducts'
import { formatLabel, formatPrice } from '../utils/filters'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error, retry } = useProduct(id)
  const [activeImage, setActiveImage] = useState(null)

  const images = product?.images?.length
    ? product.images
    : product?.thumbnail
      ? [product.thumbnail]
      : []
  const currentImage =
    activeImage && images.includes(activeImage) ? activeImage : images[0]

  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    navigate('/product')
  }

  return (
    <div className="page detail-page">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>

      {loading ? <ProductDetailSkeleton /> : null}

      {!loading && error ? <ErrorMessage message={error} onRetry={retry} /> : null}

      {!loading && !error && product ? (
        <article className="detail-layout">
          <div className="detail-media">
            <div className="detail-image">
              {currentImage ? (
                <img src={currentImage} alt={product.title} />
              ) : (
                <div className="image-fallback">No image available</div>
              )}
            </div>
            {images.length > 1 ? (
              <ul className="detail-thumbs">
                {images.map((image, index) => (
                  <li key={image}>
                    <button
                      type="button"
                      className={
                        image === currentImage
                          ? 'detail-thumb is-active'
                          : 'detail-thumb'
                      }
                      onClick={() => setActiveImage(image)}
                      aria-label={`View image ${index + 1} of ${images.length}`}
                    >
                      <img src={image} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="detail-info">
            <p className="detail-kicker">{formatLabel(product.category)}</p>
            <h1>{product.title}</h1>
            <p className="detail-price">{formatPrice(product.price)}</p>
            <p className="detail-rating" aria-label={`Rating ${product.rating} out of 5`}>
              <span aria-hidden="true">⭐</span> {Number(product.rating ?? 0).toFixed(1)}
            </p>

            <dl className="detail-meta">
              <div>
                <dt>Brand</dt>
                <dd>{product.brand || '—'}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{formatLabel(product.category)}</dd>
              </div>
            </dl>

            <section className="detail-description">
              <h2>Description</h2>
              <p>{product.description}</p>
            </section>

            <AddToCartButton product={product} className="add-to-cart--detail" />
          </div>
        </article>
      ) : null}
    </div>
  )
}

export default ProductDetail
