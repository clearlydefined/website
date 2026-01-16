import React from 'react'
import { render, screen } from '@testing-library/react'
import { WindowProvider } from '../../utils/WindowProvider'
import ComponentList from '../ComponentList'

const defaultProps = {
  renderFilterBar: () => null,
  definitions: { entries: {}, sequence: 0 },
  curations: { entries: {}, sequence: 0 },
  list: [],
  listLength: 0
}

const renderWithProviders = ui => {
  return render(<WindowProvider>{ui}</WindowProvider>)
}

describe('ComponentList', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ComponentList {...defaultProps} />)
  })

  it('renders the table headers', () => {
    renderWithProviders(<ComponentList {...defaultProps} />)
    expect(screen.getByRole('heading', { name: /component/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /score/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /release date/i })).toBeInTheDocument()
  })
})
