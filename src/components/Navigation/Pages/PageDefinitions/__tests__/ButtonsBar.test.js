import React from 'react'
import { shallow, mount } from 'enzyme'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import ButtonsBar from '../ButtonsBar'
import ShareButton from '../../../Ui/ShareButton'

const components = {
  list: [{ type: 'npm', provider: 'npmjs', name: 'async', revision: '2.6.1' }]
}

describe('ButtonsBar', () => {
  it('renders without crashing', () => {
    shallow(<ButtonsBar />)
  })
  it('checks if Clear All button is disabled when components list is empty', async () => {
    const wrapper = await shallow(
      <ButtonsBar
        components={{
          list: []
        }}
      />
    )
    const clearAllButton = wrapper.find({ children: 'Clear All' })
    expect(clearAllButton.exists()).toBeTruthy()
    expect(clearAllButton.prop('disabled')).toBe(true)
  })
  it('checks if Clear All button is enabled when components list is populated', async () => {
    const wrapper = await shallow(<ButtonsBar components={components} />)
    const clearAllButton = wrapper.find({ children: 'Clear All' })
    expect(clearAllButton.exists()).toBeTruthy()
    expect(clearAllButton.prop('disabled')).toBe(false)
  })
  it('checks if share functions are called', async () => {
    const shareUrl = jest.fn()
    const shareFile = jest.fn()
    const shareNotice = jest.fn()
    const wrapper = mount(
      <ButtonsBar
        shareUrl={shareUrl}
        shareFile={shareFile}
        shareGist={null}
        shareNotice={shareNotice}
        components={components}
      />
    )
    const wrapperShareButton = wrapper.find(ShareButton)
    wrapperShareButton.simulate('click')
    const dropdown = wrapperShareButton.find(Dropdown)
    expect(dropdown.prop('disabled')).toBe(false)

    await dropdown.simulate('click')

    const menuItems = wrapper.find(Menu.Item)
    await menuItems.forEach(menuItem => menuItem.simulate('click'))
    expect(shareUrl).toHaveBeenCalled()
    expect(shareFile).toHaveBeenCalled()
    expect(shareNotice).toHaveBeenCalled()
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
    const refreshButton = wrapper.find({ children: 'Refresh' })
    expect(refreshButton.exists()).toBeTruthy()
    expect(refreshButton.prop('disabled')).toBe(false)
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(false)
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(false)
  })
  it('checks if buttons are disabled when there are changes', async () => {
    const wrapper = await shallow(<ButtonsBar components={components} hasChanges={true} />)
    const refreshButton = wrapper.find({ children: 'Refresh' })
    expect(refreshButton.exists()).toBeTruthy()
    expect(refreshButton.prop('disabled')).toBe(true)
    const collapseButton = wrapper.find({ children: 'Collapse All' })
    expect(collapseButton.exists()).toBeTruthy()
    expect(collapseButton.prop('disabled')).toBe(true)
    const contributeButton = wrapper.find({ children: 'Contribute' })
    expect(contributeButton.exists()).toBeTruthy()
    expect(contributeButton.prop('disabled')).toBe(true)
  })
})
