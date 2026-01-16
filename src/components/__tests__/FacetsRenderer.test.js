import React from 'react'
import { render } from '@testing-library/react'
import FacetsRenderer from '../FacetsRenderer'

describe('FacetsRenderer', () => {
  it('renders without crashing', () => {
    render(<FacetsRenderer values={[]} />)
  })

  it('renders with values', () => {
    const values = [
      { value: 'core', isDifferent: false },
      { value: 'data', isDifferent: true }
    ]
    render(<FacetsRenderer values={values} />)
  })
})
