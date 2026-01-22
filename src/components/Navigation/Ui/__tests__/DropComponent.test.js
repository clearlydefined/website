import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { WindowProvider } from '../../../../utils/WindowProvider'
import ConnectedDropComponent, { DropComponent } from '../DropComponent'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const store = mockStore({ session: { token: '' } })

const MockChild = () => <div data-testid="mock-child">Child Component</div>

const props = {
  children: <MockChild />,
  dispatch: () => ({})
}

const renderWithProviders = ui => {
  return render(
    <Provider store={store}>
      <WindowProvider>{ui}</WindowProvider>
    </Provider>
  )
}

describe('DropComponent', () => {
  it('renders connected component without crashing', () => {
    renderWithProviders(<ConnectedDropComponent {...props} />)
  })

  it('renders component without crashing', () => {
    render(
      <WindowProvider>
        <DropComponent {...props} />
      </WindowProvider>
    )
  })
})
