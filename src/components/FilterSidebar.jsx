import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  formatLabel,
  isValidPriceInput,
  parseOptionalNumber,
  toBrandInputId,
  updateListingParams,
  validatePriceRange,
} from '../utils/filters'

function PriceFilterForm({ minPrice, maxPrice, priceError: urlPriceError }) {
  const [, setSearchParams] = useSearchParams()
  const [draftMin, setDraftMin] = useState(minPrice ?? '')
  const [draftMax, setDraftMax] = useState(maxPrice ?? '')
  const [priceError, setPriceError] = useState(urlPriceError || '')

  function handleApplyPrice(event) {
    event.preventDefault()

    const nextMin = parseOptionalNumber(draftMin)
    const nextMax = parseOptionalNumber(draftMax)
    const validationMessage = validatePriceRange(nextMin, nextMax)

    if (validationMessage) {
      setPriceError(validationMessage)
      return
    }

    setPriceError('')
    setSearchParams((current) =>
      updateListingParams(
        current,
        { minPrice: nextMin, maxPrice: nextMax },
        { resetPage: true },
      ),
    )
  }

  return (
    <form className="price-form" onSubmit={handleApplyPrice}>
      <label htmlFor="min-price">Minimum Price</label>
      <input
        id="min-price"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="0"
        value={draftMin}
        onChange={(event) => {
          const { value } = event.target
          if (isValidPriceInput(value)) {
            setDraftMin(value)
          }
        }}
      />

      <label htmlFor="max-price">Maximum Price</label>
      <input
        id="max-price"
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="Any"
        value={draftMax}
        onChange={(event) => {
          const { value } = event.target
          if (isValidPriceInput(value)) {
            setDraftMax(value)
          }
        }}
      />

      {priceError ? (
        <p className="field-error" role="alert">
          {priceError}
        </p>
      ) : null}

      <button type="submit" className="button">
        Apply
      </button>
    </form>
  )
}

function FilterSidebar({
  categories,
  categoriesError,
  onRetryCategories,
  brands,
  selectedCategory,
  selectedBrands,
  minPrice,
  maxPrice,
  priceError,
}) {
  const [, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(true)
  const categoryInList = categories.some((item) => item.slug === selectedCategory)

  function handleCategoryChange(event) {
    setSearchParams((current) =>
      updateListingParams(
        current,
        { category: event.target.value, brands: [] },
        { resetPage: true },
      ),
    )
  }

  function handleBrandToggle(brand) {
    const nextBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((item) => item !== brand)
      : [...selectedBrands, brand]

    setSearchParams((current) =>
      updateListingParams(current, { brands: nextBrands }, { resetPage: true }),
    )
  }

  function handleClearFilters() {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    selectedBrands.length > 0 ||
    Boolean(minPrice) ||
    Boolean(maxPrice)

  return (
    <aside className="filters" aria-label="Product filters">
      <div className="filters__header">
        <h2>Filters</h2>
        <div className="filters__header-actions">
          {hasActiveFilters ? (
            <button type="button" className="text-button" onClick={handleClearFilters}>
              Clear all
            </button>
          ) : null}
          <button
            type="button"
            className="filters-toggle"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </button>
        </div>
      </div>

      <div className={filtersOpen ? 'filters-body is-open' : 'filters-body'}>
        <section className="filter-group">
          <h3>
            <label htmlFor="category-filter">Category</label>
          </h3>
          {categoriesError ? (
            <div className="filter-error">
              <p>{categoriesError}</p>
              <button
                type="button"
                className="button button--small"
                onClick={onRetryCategories}
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {selectedCategory && !categoryInList ? (
                <option value={selectedCategory}>{formatLabel(selectedCategory)}</option>
              ) : null}
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </section>

        <section className="filter-group">
          <h3>Price Range</h3>
          <PriceFilterForm
            key={`${minPrice}-${maxPrice}-${priceError || ''}`}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceError={priceError}
          />
        </section>

        <section className="filter-group">
          <h3>Brands</h3>
          {brands.length === 0 ? (
            <p className="muted">No brands available.</p>
          ) : (
            <ul className="brand-list">
              {brands.map((brand) => {
                const checkboxId = toBrandInputId(brand)

                return (
                  <li key={brand}>
                    <label htmlFor={checkboxId}>
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </aside>
  )
}

export default FilterSidebar
