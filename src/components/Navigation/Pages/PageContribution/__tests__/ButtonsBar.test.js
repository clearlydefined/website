import React from 'react'
import { shallow } from 'enzyme'
import ButtonsBar from '../ButtonsBar'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    shallow(<ButtonsBar toggleCollapseExpandAll={() => false} />)
  })
})
