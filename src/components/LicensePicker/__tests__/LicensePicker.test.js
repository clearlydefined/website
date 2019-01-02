import React from 'react'
import { shallow } from 'enzyme'
import LicensePicker from '../LicensePicker'
import LicensePickerUtils from '../utils'
const license = 'Apache-2.0 AND MIT'
describe('LicensePicker', () => {
  it('renders without crashing', () => {
    shallow(<LicensePicker />)
  })
  it('given an existing License, change the rule conjunction OR to left path', () => {
    const wrapper = shallow(<LicensePicker value={license} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: { license: 'MIT' }
    })
  })
  it('given an existing License, add a new rule conjunction OR to right path', () => {
    const wrapper = shallow(<LicensePicker value={license} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right'])
    expect(wrapper.state('rules')).toEqual({
      left: {
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      },
      conjunction: 'or',
      right: { license: '' }
    })
  })
  it('given an existing composite License, add a new rule conjunction AND to right-right path', () => {
    const testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: {
        left: { license: 'MIT' },
        conjunction: 'and',
        right: { left: { license: 'GPL-1.0-only' }, conjunction: 'and', right: { license: '' } }
      }
    })
  })
  it('given an existing composite License, add a new rule conjunction OR to right-left path', () => {
    const testLicense = 'Apache-2.0 AND MIT AND GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right', 'left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } }
    })
  })
  it('given an existing License, add a new rule conjunction AND to right path', () => {
    const testLicense = 'Apache-2.0 OR MIT OR GPL-1.0-only'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: { left: { license: 'MIT' }, conjunction: 'and', right: { license: 'GPL-1.0-only' } }
    })
  })
  it('given an existing License, add a new rule conjunction AND to left path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'and',
      right: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } }
    })
  })
  it('given an existing License, change rule conjunction AND to right-left path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) OR MIT'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'left'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: { left: { license: 'MIT' }, conjunction: 'and', right: { license: 'GPL-1.0-only' } },
        conjunction: 'or',
        right: { license: 'MIT' }
      }
    })
  })
  it('given an existing License, add a mew rule conjunction OR to right-right path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND MIT'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: {
          left: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } },
          conjunction: 'and',
          right: { license: 'MIT' }
        },
        conjunction: 'or',
        right: { license: '' }
      }
    })
  })
  it('given an existing License, add a new rule conjunction AND to right-right path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } },
        conjunction: 'and',
        right: { left: { license: 'MIT' }, conjunction: 'and', right: { license: 'GPL-1.0-only' } }
      }
    })
  })
  it('given an existing License, add a new rule conjunction AND to right-left-right path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only OR MIT-0) AND (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('and', ['right', 'left', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: {
          left: { license: 'MIT' },
          conjunction: 'or',
          right: { left: { license: 'GPL-1.0-only' }, conjunction: 'and', right: { license: 'MIT-0' } }
        },
        conjunction: 'and',
        right: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } }
      }
    })
  })
  it('given an existing License, add a new rule conjunction OR to right-left-right path', () => {
    const testLicense = 'Apache-2.0 OR (MIT OR GPL-1.0-only) AND (MIT OR GPL-1.0-only)'
    const wrapper = shallow(<LicensePicker value={testLicense} />)
    const instance = wrapper.instance()
    instance.changeRulesConjunction('or', ['right', 'left', 'right'])
    expect(wrapper.state('rules')).toEqual({
      left: { license: 'Apache-2.0' },
      conjunction: 'or',
      right: {
        left: {
          left: { license: 'MIT' },
          conjunction: 'or',
          right: { left: { license: 'GPL-1.0-only' }, conjunction: 'or', right: { license: '' } }
        },
        conjunction: 'and',
        right: { left: { license: 'MIT' }, conjunction: 'or', right: { license: 'GPL-1.0-only' } }
      }
    })
  })
})
