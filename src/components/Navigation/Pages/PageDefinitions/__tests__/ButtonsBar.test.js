import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonsBar from '../ButtonsBar'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    render(<ButtonsBar />)
  })

  it('renders Clear All button disabled when components list is empty', () => {
    render(<ButtonsBar components={{ list: [] }} />)
    const clearAllButton = screen.getByRole('button', { name: /clear all/i })
    expect(clearAllButton).toBeDisabled()
  })

  it('renders Clear All button enabled when components list is populated', () => {
    render(<ButtonsBar components={components} />)
    const clearAllButton = screen.getByRole('button', { name: /clear all/i })
    expect(clearAllButton).not.toBeDisabled()
  })

  it('renders Refresh button enabled when there are no changes', () => {
    render(<ButtonsBar components={{ list: [] }} hasChanges={false} />)
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    expect(refreshButton).not.toBeDisabled()
  })

  it('renders Refresh button disabled when there are changes', () => {
    render(<ButtonsBar components={components} hasChanges={true} />)
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    expect(refreshButton).toBeDisabled()
  })

  it('renders Contribute button enabled when there are no changes', () => {
    render(<ButtonsBar components={{ list: [] }} hasChanges={false} />)
    const contributeButton = screen.getByRole('button', { name: /contribute/i })
    expect(contributeButton).not.toBeDisabled()
  })

  it('renders Contribute button disabled when there are changes', () => {
    render(<ButtonsBar components={components} hasChanges={true} />)
    const contributeButton = screen.getByRole('button', { name: /contribute/i })
    expect(contributeButton).toBeDisabled()
  })
})
