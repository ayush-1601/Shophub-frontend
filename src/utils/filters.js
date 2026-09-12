export const PAGE_SIZE = 8

export function parseOptionalNumber(value) {
  if (value === '' || value == null) {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function parsePage(value) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export function isValidPriceInput(value) {
  return value === '' || /^\d*\.?\d*$/.test(value)
}

export function toBrandInputId(brand) {
  return `brand-${String(brand).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function parseBrands(value) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((brand) => brand.trim())
    .filter(Boolean)
}

export function validatePriceRange(minPrice, maxPrice) {
  if (minPrice != null && minPrice < 0) {
    return 'Price cannot be negative.'
  }

  if (maxPrice != null && maxPrice < 0) {
    return 'Price cannot be negative.'
  }

  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    return 'Minimum price cannot be greater than maximum price.'
  }

  return null
}

export function applyProductFilters(products, { minPrice, maxPrice, brands }) {
  const selectedBrands = brands ?? []

  return products.filter((product) => {
    if (minPrice != null && product.price < minPrice) {
      return false
    }

    if (maxPrice != null && product.price > maxPrice) {
      return false
    }

    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false
    }

    return true
  })
}

export function getUniqueBrands(products) {
  return [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  )
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    currentPage,
  }
}

export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const uniquePages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ])

  const sorted = [...uniquePages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  const pages = []

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      pages.push('...')
    }
    pages.push(page)
  })

  return pages
}

export function updateListingParams(searchParams, updates, { resetPage = false } = {}) {
  const next = new URLSearchParams(searchParams)

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      next.delete(key)
    } else if (Array.isArray(value)) {
      next.set(key, value.join(','))
    } else {
      next.set(key, String(value))
    }
  })

  if (resetPage) {
    next.delete('page')
  }

  return next
}

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`
}

export function formatLabel(value) {
  if (!value) {
    return '—'
  }

  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
