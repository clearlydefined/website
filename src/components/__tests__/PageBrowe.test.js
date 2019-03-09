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
        },
        definitions: {
          filter: {},
          filterList: {},
          componentList: {}
        },
        curate: {
          bodies: {}
        }
      },
      definition: {
        bodies: {}
      }
    })

    const props = {
      match: { path: '/', url: '/', isExact: true, params: {} },
      location: { pathname: '/', search: '', hash: '', key: 'ip23w9' }
    }

    shallow(<ConnectedPageBrowse store={store} {...props} />)
  })
})
