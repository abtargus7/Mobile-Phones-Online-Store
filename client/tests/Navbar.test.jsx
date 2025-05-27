import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import axios from 'axios'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../src/features/userSlice'

// Mocks
vi.mock('axios')
vi.mock('sonner', () => ({
  toast: vi.fn(),
}))


// Helper to render component with router and redux
const renderWithProviders = (ui, preloadedState = {}) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState,
  })

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    ),
    store,
  }
}


it('renders logo avatar and home link', () => {
  renderWithProviders(<Navbar />)

  const fallback = screen.getByText('CN')

  const homeLink = screen.getByText(/home/i)

  expect(fallback).toBeInTheDocument()
  expect(homeLink).toBeInTheDocument()
})


it('shows login and signup when user is not logged in', () => {
  renderWithProviders(<Navbar />)

  expect(screen.getByText(/login/i)).toBeInTheDocument()
  expect(screen.getByText(/signup/i)).toBeInTheDocument()
})


it('shows logout button when user is logged in', () => {

  renderWithProviders(<Navbar />, {
    user: {
      user: { name: 'John', role: 'customer' }
    }
  })

  expect(screen.getByText(/logout/i)).toBeInTheDocument()
})

it('shows admin panel button when user is admin', () => {

  renderWithProviders(<Navbar />, {
    user: {
      user: { name: 'John', role: 'admin' }
    }
  })

  expect(screen.getByText(/admin panel/i)).toBeInTheDocument()
})


it('logs out the user successfully', async () => {
  const mockPost = axios.post
  mockPost.mockResolvedValueOnce({ status: 200, data: { message: 'Logout success' } })



  const { store } = renderWithProviders(<Navbar />, {
    user: {
      user: { name: 'John', role: 'admin' }
    }
  })

  const logoutBtn = screen.getByText(/logout/i)
  fireEvent.click(logoutBtn)

  await waitFor(() => {
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/user/logout'),
      {},
      { withCredentials: true }
    )

    expect(store.getState().user.user).toBe(null)
  })
})


import { toast } from 'sonner'

it('shows toast error if logout fails', async () => {
  const mockPost = axios.post
  mockPost.mockRejectedValueOnce(new Error('Logout Failed'))

  const { store } = renderWithProviders(<Navbar />, {
    user: {
      user: { name: 'John', role: 'user' }
    }
  })


  const logoutBtn = screen.getByText(/logout/i)
  fireEvent.click(logoutBtn)

  await waitFor(() => {
    expect(toast).toHaveBeenCalledWith('Logout Failed')
  })
})
