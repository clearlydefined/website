import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ConnectedPageContribution, { PageContribution } from '../Navigation/Pages/PageContribution'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
describe('PageContribution', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      session: { token: '' },
      ui: {
        browse: {
          filter: {},
          filterList: {},
          componentList: {}
        },
        curate: {
          bodies: {}
        },
        contribution: {
          url: {}
        }
      },
      definition: {
        bodies: {}
      }
    })

    const props = {
      match: { path: '/contribution', url: '/contribution', isExact: true, params: {} },
      location: { pathname: '/contribution', search: '', hash: '', key: 'ip23w9' }
    }

    shallow(<ConnectedPageContribution store={store} {...props} />)
  })
})
