import React from 'react'
import { shallow } from 'enzyme'
import ComponentList from '../ComponentList'

describe('ComponentList', () => {
  it('renders without crashing', () => {
    shallow(<ComponentList renderFilterBar={() => null} />)
  })
})
