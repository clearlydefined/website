import LicensePickerUtils from '../utils'

describe('LicensePickerUtils', () => {
  describe('parseLicense', () => {
    it('parses a simple license', () => {
      const result = LicensePickerUtils.parseLicense('MIT')
      expect(result).toEqual({ license: 'MIT' })
    })

    it('parses an AND expression', () => {
      const result = LicensePickerUtils.parseLicense('Apache-2.0 AND MIT')
      expect(result).toEqual({
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      })
    })

    it('parses an OR expression', () => {
      const result = LicensePickerUtils.parseLicense('Apache-2.0 OR MIT')
      expect(result).toEqual({
        left: { license: 'Apache-2.0' },
        conjunction: 'or',
        right: { license: 'MIT' }
      })
    })

    it('parses NOASSERTION as a simple license', () => {
      const result = LicensePickerUtils.parseLicense('NOASSERTION')
      expect(result).toEqual({ license: 'NOASSERTION' })
    })

    it('parses complex nested expression', () => {
      const result = LicensePickerUtils.parseLicense('Apache-2.0 OR (MIT AND GPL-1.0-only)')
      expect(result).toEqual({
        left: { license: 'Apache-2.0' },
        conjunction: 'or',
        right: {
          left: { license: 'MIT' },
          conjunction: 'and',
          right: { license: 'GPL-1.0-only' }
        }
      })
    })
  })

  describe('toString', () => {
    it('converts simple license to string', () => {
      const result = LicensePickerUtils.toString({ license: 'MIT' })
      expect(result).toBe('MIT')
    })

    it('converts AND expression to string', () => {
      const result = LicensePickerUtils.toString({
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      })
      expect(result).toBe('Apache-2.0 AND MIT')
    })

    it('converts OR expression to string', () => {
      const result = LicensePickerUtils.toString({
        left: { license: 'Apache-2.0' },
        conjunction: 'or',
        right: { license: 'MIT' }
      })
      expect(result).toBe('Apache-2.0 OR MIT')
    })

    it('converts license with plus modifier to string', () => {
      const result = LicensePickerUtils.toString({ license: 'GPL-2.0-only', plus: true })
      expect(result).toBe('GPL-2.0-only+')
    })

    it('converts license with exception to string', () => {
      const result = LicensePickerUtils.toString({ license: 'GPL-2.0-only', exception: 'Classpath-exception-2.0' })
      expect(result).toBe('GPL-2.0-only WITH Classpath-exception-2.0')
    })

    it('returns NOASSERTION for noassertion object', () => {
      const result = LicensePickerUtils.toString({ noassertion: true })
      expect(result).toBe('NOASSERTION')
    })

    it('returns null for null input', () => {
      const result = LicensePickerUtils.toString(null)
      expect(result).toBeNull()
    })
  })

  describe('isValidExpression', () => {
    it('returns true for valid simple license', () => {
      expect(LicensePickerUtils.isValidExpression('MIT')).toBe(true)
    })

    it('returns true for valid compound expression', () => {
      expect(LicensePickerUtils.isValidExpression('Apache-2.0 AND MIT')).toBe(true)
    })

    it('returns true for NOASSERTION', () => {
      expect(LicensePickerUtils.isValidExpression('NOASSERTION')).toBe(true)
    })
  })

  describe('createRules', () => {
    it('creates OR conjunction at root level', () => {
      const expression = {
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      }
      const result = LicensePickerUtils.createRules('or', expression, ['left'])
      expect(result).toEqual({
        left: { license: 'Apache-2.0' },
        conjunction: 'or',
        right: { license: 'MIT' }
      })
    })

    it('creates new rule at empty path', () => {
      const expression = { license: 'MIT' }
      const result = LicensePickerUtils.createRules('and', expression, [])
      expect(result).toEqual({
        conjunction: 'and',
        left: { license: 'MIT' },
        right: { license: '' }
      })
    })
  })

  describe('createGroup', () => {
    it('creates new group at root level', () => {
      const expression = { license: 'Apache-2.0' }
      const result = LicensePickerUtils.createGroup(expression, [])
      expect(result).toEqual({
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: {
          left: { license: '' },
          conjunction: 'and',
          right: { license: '' }
        }
      })
    })
  })

  describe('removeRule', () => {
    it('removes right rule and returns left', () => {
      const rules = {
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      }
      const result = LicensePickerUtils.removeRule(rules, ['right'])
      expect(result).toEqual({ license: 'Apache-2.0' })
    })

    it('removes left rule and returns right', () => {
      const rules = {
        left: { license: 'Apache-2.0' },
        conjunction: 'and',
        right: { license: 'MIT' }
      }
      const result = LicensePickerUtils.removeRule(rules, ['left'])
      expect(result).toEqual({ license: 'MIT' })
    })

    it('does not remove if sibling is empty', () => {
      const rules = {
        left: { license: '' },
        conjunction: 'and',
        right: { license: 'MIT' }
      }
      const result = LicensePickerUtils.removeRule(rules, ['right'])
      expect(result).toEqual(rules)
    })
  })
})
