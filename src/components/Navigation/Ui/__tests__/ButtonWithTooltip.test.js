import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonWithTooltip from '../ButtonWithTooltip'

describe('ButtonWithTooltip', () => {
  it('renders without crashing', () => {
    render(<ButtonWithTooltip tip="Test tooltip" />)
  })

  it('renders children inside the tooltip wrapper', () => {
    render(
      <ButtonWithTooltip tip="Test tooltip">
        <button type="button">Test Button</button>
      </ButtonWithTooltip>
    )
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument()
  })

  it('wraps children in a div with tooltipWrapper class', () => {
    render(
      <ButtonWithTooltip tip="Test tooltip">
        <span data-testid="child">Child content</span>
      </ButtonWithTooltip>
    )
    const child = screen.getByTestId('child')
    expect(child.parentElement).toHaveClass('tooltipWrapper')
  })
})
