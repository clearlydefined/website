import React from 'react'
import { shallow } from 'enzyme'
import LicensePickerUtils from '../utils'

const testRules = [
  { license: 'MIT', operator: 'AND', laterVersions: false },
  { license: 'Apache-2.0', operator: '', laterVersions: false }
]

describe('LicensePicker', () => {
  it('renders without crashing', () => {
    const licenseString = LicensePickerUtils.getLicenseString(testRules)
    expect(licenseString).toBe('MIT AND Apache-2.0')
  })
})
