import React from 'react'
import { shallow, mount } from 'enzyme'
import ButtonsBar from '../ButtonsBar'
import ShareButton from '../../../Ui/ShareButton'
import { DropdownButton, MenuItem } from 'react-bootstrap'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    shallow(<ButtonsBar />)
  })

  it("checks if buttons are enabled when there aren't changes", async () => {
    const wrapper = await shallow(
      <ButtonsBar
        components={{
          list: []
        }}
        hasChanges={false}
      />
    )
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(false)
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(false)
  })
  it('checks if buttons are disabled when there are changes', async () => {
    const wrapper = await shallow(<ButtonsBar components={components} hasChanges={true} />)
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(true)
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(true)
  })
})
