import React from 'react'
import { shallow } from 'enzyme'
import ConnectedDropComponent, { DropComponent } from '../DropComponent'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ComponentList from '../../../ComponentList'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const store = mockStore({ session: { token: '' } })
const props = { children: <ComponentList /> }

describe('DropComponent', () => {
  it('renders without crashing', () => {
    shallow(<ConnectedDropComponent store={store} {...props} />)
  })
})
