import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageDefinitions from '../Navigation/Pages/PageDefinitions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const defaultStore = mockStore({
  session: { token: '', isAnonymous: true },
  ui: {
    definitions: {
      filter: {},
      filterList: { list: [] },
      componentList: { list: [], transformedList: [] }
    },
    curate: {
      bodies: {},
      status: {}
    }
  },
  definition: {
    bodies: {}
  }
})

const defaultProps = {
  match: { path: '/definitions', url: '/definitions', isExact: true, params: {} },
  location: { pathname: '/definitions', search: '', hash: '', key: 'ip23w9' }
}

const renderWithProviders = (ui, { store = defaultStore } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
}

describe('PageDefinitions', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ConnectedPageDefinitions {...defaultProps} />)
  })
})
