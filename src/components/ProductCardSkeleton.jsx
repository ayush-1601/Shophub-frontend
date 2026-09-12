import Skeleton from './Skeleton'

function ProductCardSkeleton() {
  return (
    <div className="product-card product-card-skeleton">
      <Skeleton className="skeleton--image" />
      <div className="product-card__body">
        <Skeleton className="skeleton--title" />
        <Skeleton className="skeleton--line skeleton--short" />
        <Skeleton className="skeleton--button" />
      </div>
    </div>
  )
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
