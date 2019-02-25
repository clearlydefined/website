import React from 'react'
import { shallow } from 'enzyme'
import FacetsRenderer from '../FacetsRenderer'

describe('FacetsRenderer', () => {
  it('renders without crashing', () => {
    shallow(<FacetsRenderer values={[]} />)
  })
})
