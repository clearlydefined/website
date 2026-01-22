import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import EditableFieldRenderer from '../EditableFieldRenderer'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const store = mockStore({
  session: { token: '' },
  suggestion: { bodies: { entries: {} } },
  definition: { coordinates: {} }
})

const baseProps = {
  definition: { coordinates: { type: 'npm', provider: 'npmjs', name: 'test', revision: '1.0.0' } },
  previewDefinition: {},
  curationSuggestions: {},
  field: 'licensed.declared',
  label: 'test',
  placeholder: 'test'
}

const renderWithProviders = ui => {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('EditableFieldRenderer', () => {
  it('renders without crashing', () => {
    renderWithProviders(<EditableFieldRenderer {...baseProps} type="license" editable />)
    expect(screen.getAllByText('test').length).toBeGreaterThan(0)
  })

  it('renders plain string when not editable', () => {
    renderWithProviders(<EditableFieldRenderer {...baseProps} type="text" editable={false} value="test value" />)
    expect(screen.getByText('test value')).toBeInTheDocument()
  })

  it('renders editable editor for date type', () => {
    renderWithProviders(<EditableFieldRenderer {...baseProps} type="date" editable />)
  })

  it('renders modal editor for license type', () => {
    renderWithProviders(<EditableFieldRenderer {...baseProps} type="license" editable editor />)
  })
})
