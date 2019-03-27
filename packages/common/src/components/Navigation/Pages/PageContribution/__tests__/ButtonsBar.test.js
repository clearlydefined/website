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
    const wrapper = await shallow(
      <ButtonsBar
        components={{
          list: []
        }}
        hasChanges={false}
      />
    )
    const doneButton = wrapper.find({ children: 'Done' })
    expect(doneButton.exists()).toBeTruthy()
    expect(doneButton.prop('disabled')).toBe(false)
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(false)
  })
  it('checks if buttons are disabled when there are changes', async () => {
    const wrapper = await shallow(<ButtonsBar components={components} hasChanges={true} />)
    const doneButton = wrapper.find({ children: 'Done' })
    expect(doneButton.exists()).toBeTruthy()
    expect(doneButton.prop('disabled')).toBe(true)
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(true)
  })
})
