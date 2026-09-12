import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import FilterSidebar from '../components/FilterSidebar'
import Pagination from '../components/Pagination'
import ProductGrid from '../components/ProductGrid'
import { ProductSkeletonGrid } from '../components/ProductCardSkeleton'
import { useCategories, useProducts } from '../hooks/useProducts'
import {
  PAGE_SIZE,
  applyProductFilters,
  getUniqueBrands,
  paginate,
  parseBrands,
  parseOptionalNumber,
  parsePage,
  updateListingParams,
  validatePriceRange,
} from '../utils/filters'

function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || ''
  const minPriceParam = searchParams.get('minPrice') ?? ''
  const maxPriceParam = searchParams.get('maxPrice') ?? ''
  const minPrice = parseOptionalNumber(minPriceParam)
  const maxPrice = parseOptionalNumber(maxPriceParam)
  const brandsParam = searchParams.get('brands') || ''
  const brands = useMemo(() => parseBrands(brandsParam), [brandsParam])
  const page = parsePage(searchParams.get('page'))

  const { products, loading, error, retry } = useProducts(category)
  const {
    categories,
    error: categoriesError,
    retry: retryCategories,
  } = useCategories()

  const availableBrands = useMemo(() => getUniqueBrands(products), [products])
  const priceError = validatePriceRange(minPrice, maxPrice)

  const validBrands = useMemo(() => {
    if (loading || brands.length === 0) {
      return brands
    }

    return brands.filter((brand) => availableBrands.includes(brand))
  }, [brands, availableBrands, loading])

  const filteredProducts = useMemo(() => {
    if (priceError) {
      return applyProductFilters(products, { brands: validBrands })
    }

    return applyProductFilters(products, {
      minPrice,
      maxPrice,
      brands: validBrands,
    })
  }, [products, minPrice, maxPrice, validBrands, priceError])

  const { items: paginatedProducts, totalPages, currentPage } = useMemo(
    () => paginate(filteredProducts, page, PAGE_SIZE),
    [filteredProducts, page],
  )

  useEffect(() => {
    if (loading || error) {
      return
    }

    const updates = {}
    let shouldSync = false

    if (validBrands.length !== brands.length) {
      updates.brands = validBrands
      shouldSync = true
    }

    if (filteredProducts.length > 0 && page > totalPages) {
      updates.page = totalPages <= 1 ? null : totalPages
      shouldSync = true
    }

    if (filteredProducts.length === 0 && page > 1) {
      updates.page = null
      shouldSync = true
    }

    if (shouldSync) {
      setSearchParams(
        (current) => updateListingParams(current, updates),
        { replace: true },
      )
    }
  }, [
    loading,
    error,
    brands,
    validBrands,
    page,
    totalPages,
    filteredProducts.length,
    setSearchParams,
  ])

  function handlePageChange(nextPage) {
    setSearchParams((current) =>
      updateListingParams(current, {
        page: nextPage <= 1 ? null : nextPage,
      }),
    )
  }

  const hasActiveFilters =
    Boolean(category) ||
    validBrands.length > 0 ||
    minPriceParam !== '' ||
    maxPriceParam !== ''

  const start = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, filteredProducts.length)

  return (
    <div className="page listing-page">
      <div className="listing-layout">
        <FilterSidebar
          categories={categories}
          categoriesError={categoriesError}
          onRetryCategories={retryCategories}
          brands={availableBrands}
          selectedCategory={category}
          selectedBrands={validBrands}
          minPrice={minPriceParam}
          maxPrice={maxPriceParam}
          priceError={priceError}
        />

        <section className="listing-content" aria-label="Product results">
          <div className="listing-toolbar">
            <h1>Products</h1>
            {!loading && !error ? (
              <p className="muted">
                {filteredProducts.length === 0
                  ? '0 products'
                  : `Showing ${start}-${end} of ${filteredProducts.length} products`}
              </p>
            ) : null}
          </div>

          {loading ? <ProductSkeletonGrid /> : null}

          {!loading && error ? (
            <ErrorMessage message={error} onRetry={retry} />
          ) : null}

          {!loading && !error && filteredProducts.length === 0 ? (
            <EmptyState
              description={
                hasActiveFilters
                  ? 'Try changing your filters.'
                  : 'There are no products to display right now.'
              }
            />
          ) : null}

          {!loading && !error && filteredProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default ProductListing
