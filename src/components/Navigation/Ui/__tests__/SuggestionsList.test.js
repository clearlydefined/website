import React from 'react'
import { render } from '@testing-library/react'
import SuggestionsList from '../Suggestions/SuggestionsList'

describe('SuggestionsList', () => {
  it('renders without crashing', () => {
    render(<SuggestionsList items={[{ value: 'test', version: 'test.1.0' }]} />)
  })

  it('renders dropdown trigger icon', () => {
    render(<SuggestionsList items={[{ value: 'test-package', version: '1.0.0' }]} />)
    // The component renders an info-circle icon as the dropdown trigger
    expect(document.querySelector('.fa-info-circle')).toBeInTheDocument()
  })

  it('renders with multiple items', () => {
    render(
      <SuggestionsList
        items={[
          { value: 'package-1', version: '1.0.0' },
          { value: 'package-2', version: '2.0.0' }
        ]}
      />
    )
    expect(document.querySelector('.suggestionsWrapper')).toBeInTheDocument()
  })
})
