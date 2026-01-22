import React from 'react'
import { render } from '@testing-library/react'
import LicensePicker from '../LicensePicker'

describe('LicensePicker', () => {
  it('renders without crashing', () => {
    render(<LicensePicker />)
  })

  it('renders with a license value', () => {
    render(<LicensePicker value="Apache-2.0 AND MIT" />)
  })

  it('renders with NOASSERTION license', () => {
    render(<LicensePicker value="NOASSERTION" />)
  })

  it('renders with complex license expression', () => {
    render(<LicensePicker value="Apache-2.0 OR (MIT AND GPL-1.0-only)" />)
  })
})
