import React from 'react'
import { shallow } from 'enzyme'
import { FullDetailPage } from '../FullDetailView/FullDetailPage'

import configureMockStore from 'redux-mock-store'
const mockStore = configureMockStore()

describe('FullDetailsView', () => {
  let wrapper, store
  const component = { type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.0' }
  const mockLoginfn = jest.fn()
  beforeEach(() => {
    const initialState = {}
    store = mockStore(initialState)
    // Shallow render the container passing in the mock store
    wrapper = shallow(
      <FullDetailPage
        store={store}
        component={component}
        uiInspectGetDefinition={mockLoginfn}
        uiInspectGetCuration={mockLoginfn}
        uiInspectGetHarvested={mockLoginfn}
        uiCurateResetDefinitionPreview={mockLoginfn}
        uiNavigation={mockLoginfn}
      />
    )
  })
  it('renders without crashing', () => {
    //shallow(<FullDetailPage modalView={false} component={component} />)
  })
})
