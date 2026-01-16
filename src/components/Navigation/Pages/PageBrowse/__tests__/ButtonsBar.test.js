import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonsBar from '../ButtonsBar'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    render(<ButtonsBar toggleCollapseExpandAll={jest.fn()} />)
  })

  it('renders Contribute button enabled when there are no changes', () => {
    render(<ButtonsBar hasChanges={false} toggleCollapseExpandAll={jest.fn()} />)
    const contributeButton = screen.getByRole('button', { name: /contribute/i })
    expect(contributeButton).not.toBeDisabled()
  })

  it('renders Contribute button disabled when there are changes', () => {
    render(<ButtonsBar components={components} hasChanges={true} toggleCollapseExpandAll={jest.fn()} />)
    const contributeButton = screen.getByRole('button', { name: /contribute/i })
    expect(contributeButton).toBeDisabled()
  })
})
