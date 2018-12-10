import React from 'react'
import { shallow } from 'enzyme'
import EditableFieldRenderer from '../EditableFieldRenderer'
import LabelRenderer from '../LabelRenderer'
import InlineEditor from '../../../InlineEditor'

describe('EditableFieldRenderer', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditableFieldRenderer label={'test'} />)
    expect(wrapper.find(LabelRenderer).exists()).toBeTruthy()
    expect(wrapper.find(LabelRenderer).props().text).toEqual('test')
  })
  it('renders plain string', () => {
    const wrapper = shallow(<EditableFieldRenderer label={'test'} placeholder={'test'} value={'test'} />)
    const plainString = wrapper.find('.list-singleLine')
    expect(plainString.exists()).toBeTruthy()
    expect(plainString.props().children).toEqual('test')
  })
  it('renders editable editor', () => {
    const wrapper = shallow(<EditableFieldRenderer label={'test'} editable placeholder={'test'} />)
    expect(wrapper.find(LabelRenderer).exists()).toBeTruthy()
    expect(wrapper.find(LabelRenderer).props().text).toEqual('test')
    expect(wrapper.find(InlineEditor).exists()).toBeTruthy()
  })
})
