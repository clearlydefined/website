import React from 'react'
import { shallow } from 'enzyme'
import SuggestionsList from '../Suggestions/SuggestionsList'

describe('SuggestionsList', () => {
  it('renders without crashing', () => {
    shallow(<SuggestionsList />)
  })
})
