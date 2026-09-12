# 🛒 E-commerce Product Listing & Detail Application

Amazon-style product listing and detail frontend built as a frontend engineering assessment.

The app integrates with the public DummyJSON Products API and covers listing, filtering, pagination, product detail, URL-persisted listing state, a client-side cart, and shimmer loading states.

## Table of Contents

- [Repository](#-repository)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [API](#-api)
- [Project Structure](#-project-structure)
- [Architectural Decisions](#️-architectural-decisions)
- [Assumptions](#-assumptions)
- [Key User Flows](#-key-user-flows)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Error & Loading Handling](#️-error--loading-handling)
- [Responsive & Accessibility](#-responsive--accessibility)
- [Trade-offs](#️-trade-offs)
- [Improvements With More Time](#-improvements-with-more-time)
- [Testing Checklist](#-testing-checklist)
- [Screenshots](#️-screenshots)
- [Assessment Requirements](#-assessment-requirements)


## 📦 Repository

[GitHub Repository](https://github.com/ayush-1601/Shophub-frontend)

## ✨ Features

### Product Listing

- Listing page at `/product` using DummyJSON
- Responsive product grid
- Product cards with image, title, price, rating, and Add to Cart
- Clicking the card (image/title/price/rating) navigates to `/product/:id`

### Product Filtering

- Dynamic categories from `GET /products/categories` (not hardcoded)
- Category select: All Categories or a single category
- Selecting a category fetches `/products` or `/products/category/{category}`
- Min and max price inputs, applied together on **Apply**
- Empty min and/or max are handled; negatives and `min > max` show a validation message
- Brands extracted dynamically from the currently fetched products
- Multi-select brand checkboxes
- Category, price, and brand filters combine with AND
- Changing any filter resets pagination to page 1
- Brands that no longer exist after a category change are cleared

### Product Details

- Detail page at `/product/:id`
- Image (with extra thumbnails when DummyJSON returns multiple images)
- Title, price, rating, description, brand, and category
- Add to Cart
- Back button uses `navigate(-1)` so listing query params stay intact
- Falls back to `/product` if there is no in-app history (direct visit / new tab)

### Navigation & URL State

- React Router routes: `/` → `/product`, `/product`, `/product/:id`
- Listing state is stored in search params:

  `/product?category=smartphones&minPrice=100&maxPrice=500&brands=Apple,Samsung&page=2`

- Persisted values: `category`, `minPrice`, `maxPrice`, `brands`, `page`
- Empty/default values are omitted from the URL
- Back from detail restores the previous filtered/paginated listing

### Cart

- Add to Cart from listing cards (does not navigate)
- Add to Cart from the detail page (stays on the page)
- Adding the same product increases quantity instead of adding a duplicate line
- Header cart button opens a right-side sidebar (no cart route)
- Badge shows total quantity
- Quantity `+` / `-` (minimum quantity is 1)
- Remove item
- Derived subtotal (`price × quantity`, summed)
- Empty cart state
- Cart persisted in `localStorage` under `ecommerce-cart`
- Lightweight “Added to cart” button/toast feedback
- **Proceed to Checkout** is visible but intentionally does nothing except show: “Checkout is not available in this demo.”

### Loading / UX

- Listing shimmer: 8 skeleton cards
- Detail shimmer matching the two-column / stacked layout
- API error messages with Retry
- Empty listing state when filters or the API return no products
- Responsive desktop sidebar + stacked mobile layout
- Mobile filter panel can be collapsed
- Basic accessibility: alt text, labels, real `<button>` elements, `aria-label`s

**Not implemented as working features**

- Header search does not filter products (UI only)
- Header account/profile control is decorative
- No checkout page, payments, auth, or order API

## 🛠️ Tech Stack

| Technology | Role |
| --- | --- |
| React 19 | UI and component state |
| Vite | Dev server and production bundling |
| React Router DOM 7 | Client-side routes and search params |
| JavaScript / JSX | Application code (no TypeScript) |
| CSS | Layout and styling, no UI component library |
| DummyJSON | Public product/category API |
| `localStorage` | Client-side cart persistence |

React hooks and Context are used instead of Redux or Zustand. No extra runtime UI or state libraries are installed.

## 🔌 API

Base URL: `https://dummyjson.com`

All HTTP calls live in `src/services/productApi.js`.

| Endpoint | Used when |
| --- | --- |
| `GET /products?limit=0` | “All Categories” is selected |
| `GET /products/categories` | Building the category dropdown |
| `GET /products/category/{category}?limit=0` | A specific category is selected |
| `GET /products/{id}` | Product detail page |

`limit=0` asks DummyJSON for the full result set so price/brand filtering and pagination can run on the client.

## 📁 Project Structure

```text
src/
├── components/
│   ├── AddToCartButton.jsx
│   ├── CartSidebar.jsx
│   ├── EmptyState.jsx
│   ├── ErrorMessage.jsx
│   ├── FilterSidebar.jsx
│   ├── Header.jsx
│   ├── Loading.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductCardSkeleton.jsx
│   ├── ProductDetailSkeleton.jsx
│   ├── ProductGrid.jsx
│   └── Skeleton.jsx
├── context/
│   └── CartContext.jsx
├── hooks/
│   └── useProducts.js
├── pages/
│   ├── ProductDetail.jsx
│   └── ProductListing.jsx
├── services/
│   └── productApi.js
├── utils/
│   └── filters.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🏗️ Architectural Decisions

### Component architecture

Pages own data and layout. Shared UI is split into focused components (header, filters, cards, grid, pagination, cart drawer, skeletons, error/empty states). That keeps listing and detail pages readable and avoids duplicating card or cart UI.

### API layer

`productApi.js` is the only DummyJSON client. Hooks (`useProducts`, `useCategories`, `useProduct`) handle loading, errors, retry, and a small in-memory cache so Back to the listing does not always refetch.

### State management

- Listing filters and page: URL search params (`useSearchParams`)
- Fetched products/categories/detail: local hook state
- Derived lists (`filteredProducts`, page slice, brands, totals): `useMemo`
- Cart: React Context (`CartContext`) because it is shared by Header, cards, detail, and the sidebar

Cart operations: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, plus `cartItems`, `cartItemCount`, and `cartTotal`.

### URL state

Filters live in the URL so the listing can unmount (navigate to `/product/:id`) and still restore category, prices, brands, and page on Back. Filtered URLs are also bookmarkable.

### Filtering

Hybrid:

1. **Category** — API (`/products` vs `/products/category/{category}`)
2. **Price and brand** — client-side AND filters on the fetched list

### Pagination

Client-side, page size **8**. Previous is disabled on page 1; Next is disabled on the last page. Filter changes clear `page` from the URL (page 1).

### Cart

Each line is `{ id, title, price, thumbnail, quantity }`. Duplicate `id` increments quantity. Decrease stops at 1. Remove deletes the line. Count and subtotal are derived, not stored separately. Cart is written to `localStorage` (`ecommerce-cart`); malformed data falls back to an empty cart.

### Loading states

Product fetches use shimmer skeletons that match card/detail layout instead of a blank page or only a “Loading…” label.

## 🤔 Assumptions

- DummyJSON is an acceptable read-only backend for this assessment
- Client-side price/brand filtering and pagination are acceptable given DummyJSON’s full-list responses
- Page size of 8 is appropriate
- Brands come from the current product response, not a separate brand API
- Cart is frontend-only; stock is not reserved or validated
- Checkout is intentionally non-functional
- No authentication or multi-device cart sync
- Header search/account are visual only
- In-memory product cache is sufficient to reduce repeat fetches during the same session

## 🔄 Key User Flows

### Product discovery

Products → apply category / price / brand filters → paginate → open a product.

### Product detail

Listing (with query params) → card → `/product/:id` → Back → same filters and page.

### Cart

Listing or detail → Add to Cart → badge updates → open sidebar → change quantity or remove → view subtotal → Proceed to Checkout shows a demo message and does not navigate, call an API, or clear the cart.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/ayush-1601/Shophub-frontend
cd ecommerce-app
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL Vite prints, typically [http://localhost:5173](http://localhost:5173). `/` redirects to `/product`.

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🔐 Environment Variables

No environment variables are required for the current implementation. The DummyJSON base URL is defined in `src/services/productApi.js`.

## ⚠️ Error & Loading Handling

| Situation | Behavior |
| --- | --- |
| Products loading | 8 shimmer cards |
| Product detail loading | Detail-layout shimmer |
| Products or categories API failure | User-facing message + Retry |
| Invalid / missing product ID | “This product could not be found.” (404 vs generic error) |
| Filters match nothing | “No products found.” + guidance to change filters |
| Empty cart | Cart empty state, no $0 subtotal |
| Invalid price range | Validation message; invalid range is not applied |

## 📱 Responsive & Accessibility

- Desktop: filter sidebar + product grid; detail is two columns
- Mobile: stacked filters (collapsible), grid, pagination; detail stacks; cart sidebar is full width
- Cart drawer: ~400px on desktop, overlay + Escape / X / backdrop to close

Accessibility practices in the UI (not a full a11y audit):

- Image `alt` text
- Form labels and checkbox labels
- Real `<button>` elements
- `aria-label` on icon-only cart/close/quantity controls
- Keyboard-focusable controls

## ⚖️ Trade-offs

### Client-side filtering & pagination

Simple and responsive after one category fetch. Less ideal if the catalog were very large.

### React Context for cart

Enough for a small shared cart without another library. Not a general replacement for a large store.

### `localStorage`

Survives refresh in one browser. Not a server cart and not shared across devices.

### Header search UI

Present for an Amazon-like header, but search is not wired to filtering so the URL state stays limited to the required listing params.

## 🚀 Improvements With More Time

These are production next steps, not gaps that break the assessment.

### High priority

- Unit/component tests and end-to-end tests
- Debounced product search wired to the listing
- Broader accessibility testing

### Performance

- Image lazy loading / optimization
- Server-side filter/pagination if the dataset grew
- Route-level code splitting

### UX

- Sorting
- Richer image gallery
- Persistent filter drawer patterns on small screens

### Commerce

- Real checkout, auth, server cart, inventory checks, and payments

## 🧪 Testing Checklist

There are no automated tests in this repository. Manual checks:

- [x] Products load on `/product`
- [x] Category, price, and brand filters
- [x] Combined filters
- [x] Pagination and reset after filter changes
- [x] Card → detail route
- [x] Back restores listing query params
- [x] Add to Cart from card does not navigate
- [x] Add to Cart from detail stays on the page
- [x] Duplicate add increases quantity
- [x] Cart badge, quantity, remove, subtotal
- [x] Cart survives refresh
- [x] Empty cart UI
- [x] Checkout CTA shows the demo message only
- [x] Listing and detail shimmer
- [x] API error + Retry
- [x] Responsive listing and cart

## 🖼️ Screenshots

Screenshots are not in the repo yet. After capturing them, add:

- `screenshots/product-listing.png`
- `screenshots/product-detail.png`
- `screenshots/cart-sidebar.png`

## ✅ Assessment Requirements

- [x] Product Listing Page
- [x] Product Detail Page
- [x] Product image
- [x] Product title
- [x] Product price
- [x] Product rating
- [x] Category filtering
- [x] Dynamic categories
- [x] Minimum price filtering
- [x] Maximum price filtering
- [x] Dynamic brand extraction
- [x] Brand selection (multi-select)
- [x] Combined filtering
- [x] Pagination
- [x] Pagination reset when filters change
- [x] Loading state (shimmer)
- [x] Error handling
- [x] React Router
- [x] Product detail routing (`/product/:id`)
- [x] Back navigation
- [x] Filter persistence (URL query params)
- [x] Reusable components
- [x] Responsive UI
- [x] Add to Cart
- [x] Cart sidebar
- [x] Quantity controls
- [x] Remove from cart
- [x] Cart subtotal
- [x] Cart persistence (`localStorage`)
- [x] Non-functional checkout CTA
- [x] Product listing shimmer
- [x] Product detail shimmer
- [ ] Product search (header input is visual only)
- [ ] Automated tests
