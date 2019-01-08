import LicensePickerUtils from '../utils'

const testRules = {
  left: { license: 'Apache-2.0' },
  conjunction: 'or',
  right: { license: 'MIT' }
}

describe('LicensePickerUtils', () => {
  it('renders without crashing', () => {
    const licenseString = LicensePickerUtils.parseLicense('Apache-2.0 OR MIT')
    expect(licenseString).toEqual(testRules)
  })
})
