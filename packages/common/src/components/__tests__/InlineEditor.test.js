import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import InlineEditor from '../InlineEditor'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
describe('InlineEditor', () => {
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
      },
      suggestion: {
        suggestions: {}
      }
    })

    shallow(
      <InlineEditor onChange={() => {}} store={store} placeholder={'test'} type={'text'} field={'licensed.declared'} />
    )
  })
})
