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

  it('parse a definition with no license', () => {
    const licenseString = LicensePickerUtils.parseLicense('NOASSERTION')
    expect(licenseString).toEqual({ license: 'NOASSERTION' })
  })

  it('determines if spdx expression is valid', () => {
    const data = {
      MIT: true,
      'MIT-0': true,
      'MIT AND Apache-2.0': true,
      'MIT OR Apache-2.0': true,
      junk: true,
      'MIT AND ADSL AND (AFL-3.0 OR AGPL-1.0-only)': true,
      null: true,
      NONE: true,
      NOASSERTION: true
    }

    for (let input of Object.keys(data)) {
      expect(LicensePickerUtils.isValidExpression(input)).toEqual(data[input])
    }
  })
})
