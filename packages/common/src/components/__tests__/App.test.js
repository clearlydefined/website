import React from 'react'
import { shallow } from 'enzyme'
import { App, Header, Footer } from '../'

describe('App', () => {
  it('renders without crashing', () => {
    shallow(<App />)
  })
  it('renders the header', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toContainReact(<Header />)
  })
  it('renders the content', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.App-content')).toExist()
  })
  it('renders the footer', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toContainReact(<Footer />)
  })
})
