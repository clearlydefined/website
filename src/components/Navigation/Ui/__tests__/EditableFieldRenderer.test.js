import React from 'react'
import { shallow } from 'enzyme'
import EditableFieldRenderer from '../EditableFieldRenderer'
import LabelRenderer from '../LabelRenderer'
import InlineEditor from '../../../InlineEditor'
import ModalEditor from '../../../ModalEditor'

const parentFunction = jest.fn()

const props = {
  definition: {},
  previewDefinition: {},
  curationSuggestions: {},
  field: 'licensed.declared',
  type: 'license',
  label: 'test',
  editable: true,
  placeholder: 'test'
}

describe('EditableFieldRenderer', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<EditableFieldRenderer label={'test'} {...props} />)
    expect(wrapper.find(LabelRenderer).exists()).toBeTruthy()
    expect(wrapper.find(LabelRenderer).props().text).toEqual('test')
  })
  it('renders plain string', () => {
    const customProps = { ...props, type: 'text', editable: false }
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} placeholder={'test'} value={'test'} {...customProps} />
    )
    const plainString = wrapper.find('.list-singleLine')
    expect(plainString.exists()).toBeTruthy()
    expect(plainString.props().children).toEqual('test')
  })
  it('renders editable editor', () => {
    const customProps = { ...props, type: 'date' }
    const wrapper = shallow(<EditableFieldRenderer label={'test'} editable placeholder={'test'} {...customProps} />)
    expect(wrapper.find(InlineEditor).exists()).toBeTruthy()
  })
  it('renders modal editor', () => {
    const customProps = { ...props, type: 'license' }
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} editor {...customProps} />
    )
    expect(wrapper.find(ModalEditor).exists()).toBeTruthy()
  })
  it('check onchange function', () => {
    const parentFunction = jest.fn()
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} onChange={parentFunction} {...props} />
    )
    wrapper.find(InlineEditor).prop('onChange')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check onchange function on modal editor', () => {
    const customProps = { ...props, type: 'license' }
    const parentFunction = jest.fn()
    const wrapper = shallow(
      <EditableFieldRenderer
        label={'test'}
        editable
        placeholder={'test'}
        onChange={parentFunction}
        editor
        {...customProps}
      />
    )
    wrapper.find(ModalEditor).prop('onChange')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check handleRevert function', () => {
    const wrapper = shallow(
      <EditableFieldRenderer label={'test'} editable placeholder={'test'} handleRevert={parentFunction} {...props} />
    )
    wrapper.find(InlineEditor).prop('onRevert')(parentFunction)
    expect(parentFunction).toHaveBeenCalled()
  })
  it('check computedValuesfor field of type license', () => {
    const customProps = { ...props, type: 'license' }
    const wrapper = shallow(<EditableFieldRenderer {...customProps} />)
    expect(wrapper.state()).toEqual({ computedValue: '', initialValue: '' })
  })
  it('check computedValues for field of type date', () => {
    const customProps = { ...props, type: 'date' }
    const wrapper = shallow(<EditableFieldRenderer {...customProps} />)
    expect(wrapper.state()).toEqual({ computedValue: null, initialValue: null})
  })
  it('check computedValues for field of type coordinates', () => {
    const customProps = { ...props, type: 'coordinates' }
    const wrapper = shallow(<EditableFieldRenderer {...customProps} />)
    expect(wrapper.state()).toEqual({ computedValue: null, initialValue: null })
  })
})
