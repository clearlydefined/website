import React from 'react'
import { shallow } from 'enzyme'
import CurationData from '../CurationData'
import Collapse from 'antd/lib/collapse'
const Panel = Collapse.Panel
describe('CurationData', () => {
  it('renders without crashing', () => {
    shallow(<CurationData />)
  })
  it('renders a default text if curations are empty', async () => {
    const wrapper = shallow(<CurationData />)
    expect(wrapper.props().children).toEqual(<p>No curations found for this component</p>)
  })
  it('renders a list of curations', async () => {
    const mockedCurations = [{ number: 100 }, { number: 10 }]
    const wrapper = shallow(<CurationData curations={mockedCurations} />)
    expect(wrapper.find(Collapse).exists()).toBeTruthy()
    expect(wrapper.find(Panel).exists()).toBeTruthy()
    expect(wrapper.find(Panel).length).toBe(mockedCurations.length)
  })
})
