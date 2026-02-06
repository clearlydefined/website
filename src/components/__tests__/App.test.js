import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import App from '../App'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const defaultStore = mockStore({
  session: { isAnonymous: true, isFetching: false },
  navigation: [],
  ui: { header: {} },
  loader: { isLoading: 0 }
})

const renderWithProviders = (ui, { store = defaultStore } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
  })

  it('renders the header', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveClass('App-content')
  })

  it('renders the footer', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
