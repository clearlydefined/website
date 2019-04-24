import React from 'react'
import { shallow } from 'enzyme'
import ButtonsBar from '../ButtonsBar'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    shallow(<ButtonsBar />)
  })

  it("checks if buttons are enabled when there aren't changes", async () => {
    const wrapper = await shallow(<ButtonsBar hasChanges={false} />)
    const toggleCollapseButton = wrapper.find({ children: 'Toggle Collapse' })
    expect(toggleCollapseButton.exists()).toBeTruthy()
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(false)
  })

  it('checks if buttons are disabled when there are changes', async () => {
    const wrapper = await shallow(<ButtonsBar components={components} hasChanges={true} />)
    const toggleCollapseButton = wrapper.find({ children: 'Toggle Collapse' })
    expect(toggleCollapseButton.exists()).toBeTruthy()
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(true)
  })
})
