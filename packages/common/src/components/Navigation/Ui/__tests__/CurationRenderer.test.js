import React from 'react'
import { shallow } from 'enzyme'
import CurationRenderer from '../CurationRenderer'
import { Tag } from 'antd'
import TwoLineEntry from '../../../TwoLineEntry'

const testCuration = {
  pr: {
    number: 1,
    title: 'test',
    state: 'closed',
    merged_at: '2018-11-13T02:44:34Z',
    user: {
      login: 'test'
    }
  }
}

const testPendingCuration = {
  pr: {
    number: 1,
    title: 'test',
    state: 'open',
    user: {
      login: 'test'
    }
  }
}

describe('CurationRenderer', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<CurationRenderer contribution={testCuration} />)
    expect(wrapper.find(TwoLineEntry).exists()).toBeTruthy()
    expect(wrapper.find(TwoLineEntry).props().message).toEqual(<span>@{testCuration.pr.user.login}</span>)
  })
  it('check the onClick function', () => {
    const parentClick = jest.fn()
    const wrapper = shallow(<CurationRenderer contribution={testCuration} onClick={parentClick} />)
    wrapper.find(TwoLineEntry).simulate('click')
    expect(parentClick).toHaveBeenCalled()
  })
  it('renders a purple color for a merged curation', () => {
    const wrapper = shallow(<CurationRenderer contribution={testCuration} />)
    const twoline = wrapper.find(TwoLineEntry)
    expect(twoline.props().headline).toEqual(
      <span>
        #{testCuration.pr.number} {testCuration.pr.title}{' '}
        <Tag className="cd-badge" color={'purple'}>
          {'Merged'}
        </Tag>
      </span>
    )
  })
  it('renders a green color for a pending curation', () => {
    const wrapper = shallow(<CurationRenderer contribution={testPendingCuration} />)
    const twoline = wrapper.find(TwoLineEntry)
    expect(twoline.props().headline).toEqual(
      <span>
        #{testPendingCuration.pr.number} {testPendingCuration.pr.title}{' '}
        <Tag className="cd-badge" color={'green'}>
          {'Open'}
        </Tag>
      </span>
    )
  })
})
