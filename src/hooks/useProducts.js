import { useCallback, useEffect, useState } from 'react'
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
} from '../services/productApi'

const productCache = new Map()
let categoriesCache = null

export function useProducts(category) {
  const cacheKey = category || 'all'
  const [retryIndex, setRetryIndex] = useState(0)
  const [products, setProducts] = useState(() => productCache.get(cacheKey) ?? [])
  const [fetchedKey, setFetchedKey] = useState(() =>
    productCache.has(cacheKey) ? cacheKey : null,
  )
  const [loading, setLoading] = useState(() => !productCache.has(cacheKey))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (retryIndex === 0 && productCache.has(cacheKey)) {
      return undefined
    }

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = category
          ? await getProductsByCategory(category)
          : await getProducts()

        if (!cancelled) {
          productCache.set(cacheKey, data)
          setProducts(data)
          setFetchedKey(cacheKey)
        }
      } catch {
        if (!cancelled) {
          setProducts([])
          setFetchedKey(cacheKey)
          setError('Unable to load products. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [category, cacheKey, retryIndex])

  const retry = useCallback(() => {
    productCache.delete(cacheKey)
    setRetryIndex((value) => value + 1)
  }, [cacheKey])

  const isCurrent = fetchedKey === cacheKey

  return {
    products: isCurrent ? products : (productCache.get(cacheKey) ?? []),
    loading: isCurrent ? loading : !productCache.has(cacheKey),
    error: isCurrent ? error : null,
    retry,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState(() => categoriesCache ?? [])
  const [loading, setLoading] = useState(() => !categoriesCache)
  const [error, setError] = useState(null)
  const [retryIndex, setRetryIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (retryIndex === 0 && categoriesCache) {
      return undefined
    }

    async function loadCategories() {
      setLoading(true)
      setError(null)

      try {
        const data = await getCategories()
        if (!cancelled) {
          categoriesCache = data
          setCategories(data)
        }
      } catch {
        if (!cancelled) {
          setCategories([])
          setError('Unable to load categories. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [retryIndex])

  const retry = useCallback(() => {
    categoriesCache = null
    setRetryIndex((value) => value + 1)
  }, [])

  return { categories, loading, error, retry }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(id ? null : 'This product could not be found.')
  const [retryIndex, setRetryIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    if (!id) {
      return undefined
    }

    async function loadProduct() {
      setLoading(true)
      setError(null)
      setProduct(null)

      try {
        const data = await getProductById(id)
        if (!cancelled) {
          setProduct(data)
        }
      } catch (err) {
        if (!cancelled) {
          setProduct(null)
          setError(
            err?.status === 404
              ? 'This product could not be found.'
              : 'Unable to load this product. Please try again.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [id, retryIndex])

  const retry = useCallback(() => {
    setRetryIndex((value) => value + 1)
  }, [])

  return { product, loading, error, retry }
}
