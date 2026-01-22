import React from 'react'
import { render } from '@testing-library/react'
import ButtonsBar from '../ButtonsBar'

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    render(<ButtonsBar toggleCollapseExpandAll={() => false} />)
  })
})
