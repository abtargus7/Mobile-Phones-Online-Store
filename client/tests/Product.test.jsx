// tests/Product.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Product from '../src/pages/Product'
import axios from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { toast } from 'sonner'

// Mock axios and toast
vi.mock('axios')
vi.mock('sonner', () => ({
  toast: vi.fn(),
}))

const renderWithRouter = (id) => {
  render(
    <MemoryRouter initialEntries={[`/product/${id}`]}>
      <Routes>
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </MemoryRouter>
  )
}

const mockProduct = {
  title: 'Test Product',
  description: 'This is a test description',
  ProductImages: [{ image: 'http://testimage.com/image.jpg' }],
  ProductVariants: [
    {
      id: 1,
      variantTitle: 'Variant 1',
      price: 100,
      comparePrice: 120,
    },
    {
      id: 2,
      variantTitle: 'Variant 2',
      price: 150,
      comparePrice: 180,
    },
  ],
}

describe('Product page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading initially', () => {
    axios.get.mockResolvedValue({ status: 200, data: { data: mockProduct } })
    renderWithRouter(123)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('fetches and displays product data correctly', async () => {
    axios.get.mockResolvedValue({ status: 200, data: { data: mockProduct } })

    renderWithRouter(123)

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockProduct.ProductImages[0].image)

    expect(screen.getByText(`₹ ${mockProduct.ProductVariants[0].price}`)).toBeInTheDocument()
    expect(screen.getByText(`₹ ${mockProduct.ProductVariants[0].comparePrice}`)).toBeInTheDocument()

    mockProduct.ProductVariants.forEach((variant) => {
      expect(screen.getByText(variant.variantTitle)).toBeInTheDocument()
    })

    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()
  })

  it('shows error toast on API failure', async () => {
    axios.get.mockRejectedValue({ response: { data: { message: 'Not Found' } } })

    renderWithRouter(999)

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Not Found')
    })

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
