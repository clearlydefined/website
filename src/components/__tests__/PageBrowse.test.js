import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageBrowse from '../Navigation/Pages/PageBrowse'

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
    definitions: {
      filter: {},
      filterList: { list: [] },
      componentList: { list: [], transformedList: [] }
    },
    curate: {
      bodies: {}
    }
  },
  definition: {
    bodies: {}
  }
})

const defaultProps = {
  match: { path: '/', url: '/', isExact: true, params: {} },
  location: { pathname: '/', search: '', hash: '', key: 'ip23w9' },
  history: {
    replace: jest.fn(),
    push: jest.fn(),
    listen: jest.fn(),
    location: { pathname: '/', search: '', hash: '' }
  }
}

const renderWithProviders = (ui, { store = defaultStore } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
}

describe('PageBrowse', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ConnectedPageBrowse {...defaultProps} />)
  })
})
