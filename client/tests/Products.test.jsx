import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import { vi } from 'vitest'
import Products from '../src/components/Products'
import userReducer from '../src/features/userSlice'
import { toast } from 'sonner'

// Mocks
vi.mock('axios')
vi.mock('sonner', () => ({
  toast: vi.fn(),
}))

// Mock ProductCard to isolate the test
vi.mock('../src/components/ProductCard', () => ({
  default: ({ title }) => <div data-testid="product-card">{title}</div>,
}))

// Helper to render with providers
const renderWithProviders = (ui, preloadedState = {}) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState,
  })

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  }
}

describe('Products Component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing and calls API', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { data: [] },
    })

    renderWithProviders(<Products />)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/product'))
    })
  })

  it('renders product cards when data is received', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'T-Shirt',
        ProductImages: [{ image: 'shirt.jpg' }],
        ProductVariants: [{ price: 299, comparePrice: 499 }],
      },
      {
        id: '2',
        title: 'Jeans',
        ProductImages: [{ image: 'jeans.jpg' }],
        ProductVariants: [{ price: 799, comparePrice: 999 }],
      },
    ]

    axios.get.mockResolvedValue({
      status: 200,
      data: { data: mockProducts },
    })

    renderWithProviders(<Products />)

    await waitFor(() => {
      const cards = screen.getAllByTestId('product-card')
      expect(cards).toHaveLength(2)
      expect(cards[0]).toHaveTextContent('T-Shirt')
      expect(cards[1]).toHaveTextContent('Jeans')
    })
  })

  it('shows toast error if product fetch fails with response message', async () => {
    axios.get.mockRejectedValue({
      response: { data: { message: 'No products found' } },
    })

    renderWithProviders(<Products />)

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('No products found')
    })
  })

  it('shows fallback toast error on generic error', async () => {
    axios.get.mockRejectedValue(new Error('Something went wrong'))

    renderWithProviders(<Products />)

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Something went wrong')
    })
  })
})
