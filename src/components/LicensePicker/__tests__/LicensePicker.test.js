import React from 'react'
import { shallow } from 'enzyme'
import LicensePicker from '../LicensePicker'

describe('LicensePicker', () => {
  it('renders without crashing', () => {
    shallow(<LicensePicker />)
  })
})
