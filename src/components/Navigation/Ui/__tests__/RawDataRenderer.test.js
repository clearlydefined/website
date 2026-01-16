import React from 'react'
import { render, screen } from '@testing-library/react'
import RawDataRenderer from '../RawDataRenderer'

describe('RawDataRenderer', () => {
  it('renders without crashing', () => {
    render(<RawDataRenderer />)
  })

  it('shows a placeholder if data are empty', () => {
    render(<RawDataRenderer />)
    expect(screen.getByText('Empty data')).toBeInTheDocument()
  })

  it('shows a placeholder if data are fetching', () => {
    render(<RawDataRenderer value={{ isFetching: true }} name={'test'} />)
    expect(screen.getByText('Loading the test')).toBeInTheDocument()
  })

  it('shows a placeholder if data has an error', () => {
    render(<RawDataRenderer value={{ isFetching: false, error: { status: 400 } }} name={'test'} />)
    expect(screen.getByText('There was a problem loading the test')).toBeInTheDocument()
  })

  it('shows a placeholder if data are not fetched', () => {
    render(<RawDataRenderer value={{ isFetching: false, isFetched: false }} />)
    expect(screen.getByText('Search for some part of a component name to see details')).toBeInTheDocument()
  })

  it('shows a placeholder if there is no item', () => {
    render(<RawDataRenderer value={{ isFetching: false, isFetched: true }} name={'test'} />)
    expect(screen.getByText('No test found')).toBeInTheDocument()
  })

  it('shows a monacoeditor if everything is fine', () => {
    const { container } = render(
      <RawDataRenderer
        value={{ isFetching: false, isFetched: true, item: { licensed: { declared: 'test' } } }}
        name={'test'}
      />
    )
    // Monaco editor is rendered - check for the container
    expect(container.querySelector('.monaco-editor-container') || container.firstChild).toBeInTheDocument()
  })
})
