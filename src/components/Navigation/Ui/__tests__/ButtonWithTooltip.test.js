import React from 'react'
import { shallow } from 'enzyme'
import ButtonWithTooltip from '../ButtonWithTooltip'

describe('ButtonWithTooltip', () => {
  it('renders without crashing', () => {
    shallow(<ButtonWithTooltip />)
  })
  it('render a button as a child', async () => {
    const wrapper = shallow(<ButtonWithTooltip button={<button>Test</button>} />)
    expect(wrapper.props().children).toEqual(<button>Test</button>)
  })
})
