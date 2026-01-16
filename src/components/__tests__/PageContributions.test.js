import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageContribution from '../Navigation/Pages/PageContribution'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const defaultStore = mockStore({
  session: { token: '', isAnonymous: true },
  ui: {
    browse: {
      filter: {},
      filterList: {},
      componentList: { list: [], transformedList: [] }
    },
    curate: {
      bodies: {}
    },
    contribution: {
      url: {},
      componentList: { list: [], transformedList: [] }
    }
  },
  definition: {
    bodies: {}
  }
})

const defaultProps = {
  match: { path: '/contribution', url: '/contribution', isExact: true, params: {} },
  location: { pathname: '/contribution', search: '', hash: '', key: 'ip23w9' }
}

const renderWithProviders = (ui, { store = defaultStore } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
}

describe('PageContribution', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ConnectedPageContribution {...defaultProps} />)
  })
})
