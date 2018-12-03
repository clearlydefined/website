import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageBrowse, { PageBrowse } from '../Navigation/Pages/PageBrowse'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
describe('PageBrowse', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      session: { token: '' },
      ui: {
        browse: {
          filter: {},
          filterList: {},
          componentList: {}
        }
      },
      definition: {
        bodies: {}
      }
    })

    const props = {
      match: { path: '/browse', url: '/browse', isExact: true, params: {} },
      location: { pathname: '/browse', search: '', hash: '', key: 'ip23w9' }
    }

    shallow(<ConnectedPageBrowse store={store} {...props} />)
  })
})
