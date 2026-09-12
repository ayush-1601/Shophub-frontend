import Skeleton from './Skeleton'

function ProductDetailSkeleton() {
  return (
    <div className="detail-layout" aria-busy="true" aria-label="Loading product details">
      <div className="detail-media">
        <Skeleton className="skeleton--detail-image" />
      </div>
      <div className="detail-info">
        <Skeleton className="skeleton--kicker" />
        <Skeleton className="skeleton--detail-title" />
        <Skeleton className="skeleton--line skeleton--price" />
        <Skeleton className="skeleton--line skeleton--short" />
        <Skeleton className="skeleton--line" />
        <Skeleton className="skeleton--line" />
        <Skeleton className="skeleton--block" />
        <Skeleton className="skeleton--block" />
        <Skeleton className="skeleton--button skeleton--detail-button" />
      </div>
    </div>
  )
}

export default ProductDetailSkeleton
