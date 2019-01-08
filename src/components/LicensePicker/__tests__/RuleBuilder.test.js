import React from 'react'
import { shallow } from 'enzyme'
import RuleBuilder from '../RuleBuilder'

describe('RuleBuilder', () => {
  it('renders without crashing', () => {
    shallow(<RuleBuilder rule={{}} />)
  })
})
