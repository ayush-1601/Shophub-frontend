import { formatLabel } from '../utils/filters'

const BASE_URL = 'https://dummyjson.com'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    const error = new Error('Request failed')
    error.status = response.status
    throw error
  }

  return response.json()
}

export async function getProducts() {
  const data = await request('/products?limit=0')
  return data.products ?? []
}

export async function getCategories() {
  const data = await request('/products/categories')
  const categories = Array.isArray(data) ? data : []

  return categories.map((item) => {
    if (typeof item === 'string') {
      return { slug: item, name: formatLabel(item) }
    }

    return {
      slug: item.slug,
      name: item.name || formatLabel(item.slug),
    }
  })
}

export async function getProductsByCategory(category) {
  const data = await request(
    `/products/category/${encodeURIComponent(category)}?limit=0`,
  )
  return data.products ?? []
}

export async function getProductById(id) {
  return request(`/products/${encodeURIComponent(id)}`)
}

