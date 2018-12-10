import LicensePickerUtils from '../utils'
import valid from 'spdx-expression-validate'

const testRules = [
  { license: 'MIT', operator: 'AND', laterVersions: false },
  { license: 'Apache-2.0', operator: '', laterVersions: false }
]

describe('LicensePicker', () => {
  it('renders without crashing', () => {
    const licenseString = LicensePickerUtils.getLicenseString(testRules)
    expect(licenseString).toBe('MIT AND Apache-2.0')
    expect(valid(licenseString)).toBe(true)
  })
})
