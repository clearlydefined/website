import React from 'react'
import { shallow } from 'enzyme'
import RawDataRenderer from '../RawDataRenderer'
import PlaceholderRenderer from '../PlaceholderRenderer'
import Editor from '@monaco-editor/react';

describe('RawDataRenderer', () => {
  it('renders without crashing', () => {
    shallow(<RawDataRenderer />)
  })
  it('shows a placeholder if data are empty', () => {
    const wrapper = shallow(<RawDataRenderer />)
    expect(wrapper.find(PlaceholderRenderer).exists()).toBeTruthy()
    const placeholder = wrapper.find(PlaceholderRenderer)
    expect(placeholder.props().message).toEqual(`Empty data`)
  })
  it('shows a placeholder if data are fetching', () => {
    const wrapper = shallow(<RawDataRenderer value={{ isFetching: true }} name={'test'} />)
    expect(wrapper.find(PlaceholderRenderer).exists()).toBeTruthy()
    const placeholder = wrapper.find(PlaceholderRenderer)
    expect(placeholder.props().message).toEqual(`Loading the test`)
  })
  it('shows a placeholder if data has a error', () => {
    const wrapper = shallow(<RawDataRenderer value={{ isFetching: false, error: { status: 400 } }} name={'test'} />)
    expect(wrapper.find(PlaceholderRenderer).exists()).toBeTruthy()
    const placeholder = wrapper.find(PlaceholderRenderer)
    expect(placeholder.props().message).toEqual('There was a problem loading the test')
  })
  it('shows a placeholder if data are not fetched', () => {
    const wrapper = shallow(<RawDataRenderer value={{ isFetching: false, isFetched: false }} />)
    expect(wrapper.find(PlaceholderRenderer).exists()).toBeTruthy()
    const placeholder = wrapper.find(PlaceholderRenderer)
    expect(placeholder.props().message).toEqual('Search for some part of a component name to see details')
  })
  it('shows a placeholder if there is no item', () => {
    const wrapper = shallow(<RawDataRenderer value={{ isFetching: false, isFetched: true }} name={'test'} />)
    expect(wrapper.find(PlaceholderRenderer).exists()).toBeTruthy()
    const placeholder = wrapper.find(PlaceholderRenderer)
    expect(placeholder.props().message).toEqual(`No test found`)
  })
  it('shows a monacoeditor if everything is fine', () => {
    const wrapper = shallow(
      <RawDataRenderer
        value={{ isFetching: false, isFetched: true, item: { licensed: { declared: 'test' } } }}
        name={'test'}
      />
    )
    expect(wrapper.find(Editor).exists()).toBeTruthy()
  })
})
