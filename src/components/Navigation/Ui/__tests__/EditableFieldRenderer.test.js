import React from 'react'
import { shallow } from 'enzyme'
import EditableFieldRenderer from '../EditableFieldRenderer'
import LabelRenderer from '../LabelRenderer'
import InlineEditor from '../../../InlineEditor'
import ModalEditor from '../../../ModalEditor'

const parentFunction = jest.fn()

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
    expect(wrapper.find(InlineEditor).exists()).toBeTruthy()
  })
  it('renders modal editor', () => {
    const wrapper = shallow(<EditableFieldRenderer label={'test'} editable placeholder={'test'} editor />)
    expect(wrapper.find(ModalEditor).exists()).toBeTruthy()
  })
  it('check onchange function', () => {
    const parentFunction = jest.fn()
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} onChange={parentFunction} />
    )
    wrapper.find(InlineEditor).prop('onChange')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check onchange function on modal editor', () => {
    const parentFunction = jest.fn()
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} onChange={parentFunction} editor />
    )
    wrapper.find(ModalEditor).prop('onChange')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check handleRevert function', () => {
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} handleRevert={parentFunction} />
    )
    wrapper.find(InlineEditor).prop('onRevert')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check computedValuesfor field of type license', () => {
    const props = {
      definition: {},
      previewDefinition: {},
      field: 'licensed.declared',
      type: 'license',
      label: 'test',
      editable: true,
      placeholder: 'test'
    }
    const wrapper = shallow(<EditableFieldRenderer {...props} />)
    expect(wrapper.state()).toEqual({ computedValue: '', initialValue: '' })
  })
  it('check computedValues for field of type date', () => {
    const props = {
      definition: {},
      previewDefinition: {},
      field: 'licensed.declared',
      type: 'date',
      label: 'test',
      editable: true,
      placeholder: 'test'
    }
    const wrapper = shallow(<EditableFieldRenderer {...props} />)
    expect(wrapper.state()).toEqual({ computedValue: null, initialValue: null })
  })
  it('check computedValues for field of type coordinates', () => {
    const props = {
      definition: {},
      previewDefinition: {},
      field: 'licensed.declared',
      type: 'coordinates',
      label: 'test',
      editable: true,
      placeholder: 'test'
    }
    const wrapper = shallow(<EditableFieldRenderer {...props} />)
    expect(wrapper.state()).toEqual({ computedValue: null, initialValue: null })
  })
})
