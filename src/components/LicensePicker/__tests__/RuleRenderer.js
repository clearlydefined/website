import React from 'react'
import { shallow } from 'enzyme'
import RuleRenderer from '../RuleRenderer'

const ruleObject = {
  license: '',
  conjunction: '',
  plus: false
}

describe('LicensePicker', () => {
  it('renders without crashing', () => {
    shallow(<RuleRenderer rule={ruleObject} />)
  })
})
