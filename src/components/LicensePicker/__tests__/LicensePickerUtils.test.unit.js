import LicensePickerUtils from '../utils'
import valid from 'spdx-expression-validate'
import parse from 'spdx-expression-parse'

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
  it('validate a license', () => {
    const license = 'MIT-0'
    const licenseParsed = parse(license)
    const licenseValid = valid(license)
    expect(licenseParsed).toEqual({ license })
    expect(licenseValid).toBe(true)
  })
  it('validate a license', () => {
    const license = 'MIT-CMU'
    const licenseParsed = parse(license)
    const licenseValid = valid(license)
    expect(licenseParsed).toEqual({ license })
    expect(licenseValid).toBe(true)
  })
})
