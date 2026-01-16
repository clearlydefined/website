import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import CurationRenderer from '../CurationRenderer'

const testCuration = {
  pr: {
    number: 1,
    title: 'test',
    state: 'closed',
    merged_at: '2018-11-13T02:44:34Z',
    user: {
      login: 'testuser'
    }
  }
}

const testPendingCuration = {
  pr: {
    number: 1,
    title: 'test',
    state: 'open',
    user: {
      login: 'testuser'
    }
  }
}

describe('CurationRenderer', () => {
  it('renders without crashing', () => {
    render(<CurationRenderer contribution={testCuration} />)
    expect(screen.getByText(/@testuser/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<CurationRenderer contribution={testCuration} onClick={handleClick} />)
    const entry = screen.getByText(/@testuser/).closest('.list-row') || screen.getByText(/@testuser/).parentElement
    fireEvent.click(entry)
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders Merged tag for a merged curation', () => {
    render(<CurationRenderer contribution={testCuration} />)
    expect(screen.getByText('Merged')).toBeInTheDocument()
  })

  it('renders Open tag for a pending curation', () => {
    render(<CurationRenderer contribution={testPendingCuration} />)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })
})
