import React from 'react'
import { shallow } from 'enzyme'
import CurationRenderer from '../CurationRenderer'
import { Tag } from 'antd'
import TwoLineEntry from '../../../TwoLineEntry'

const testCuration = {
  number: 1,
  title: 'test',
  status: 'merged',
  contributor: 'test'
}

const testPendingCuration = {
  number: 1,
  title: 'test',
  status: 'pending',
  contributor: 'test'
}

describe('CurationRenderer', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<CurationRenderer curation={testCuration} />)
    expect(wrapper.find(TwoLineEntry).exists()).toBeTruthy()
    expect(wrapper.find(TwoLineEntry).props().message).toEqual(<span>@{testCuration.contributor}</span>)
  })
  it('renders a green color for a merged curation', () => {
    const wrapper = shallow(<CurationRenderer curation={testCuration} />)
    const twoline = wrapper.find(TwoLineEntry)
    expect(twoline.props().headline).toEqual(
      <span>
        #{testCuration.number} {testCuration.title} <Tag color={'green'}>{'Curated'}</Tag>
      </span>
    )
  })
  it('renders a gold color for a pending curation', () => {
    const wrapper = shallow(<CurationRenderer curation={testPendingCuration} />)
    const twoline = wrapper.find(TwoLineEntry)
    expect(twoline.props().headline).toEqual(
      <span>
        #{testPendingCuration.number} {testPendingCuration.title} <Tag color={'gold'}>{'Pending'}</Tag>
      </span>
    )
  })
})
