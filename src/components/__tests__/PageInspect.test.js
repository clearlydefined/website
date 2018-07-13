import React from 'react'
import { shallow as enzymeShallow } from 'enzyme'
import { MonacoEditorWrapper, FilterBar } from '../'
import { PageInspect } from '../PageInspect' // get store unconnected component

describe('PageInspect', () => {
  const shallow = (comp, opts = {}) => enzymeShallow(comp, { disableLifecycleMethods: true, ...opts })
  const initialProps = {
    token: 'foo',
    path: '/inspect',
    filterValue: '',
    filterOptions: {},
    definition: {},
    curation: {},
    harvest: {}
  }

  it('renders the page without crashing', () => {
    const wrapper = shallow(<PageInspect {...initialProps} />)
    expect(wrapper.find('[name="Current definition"]')).toExist()
    expect(wrapper.find('[name="Curations"]')).toExist()
    expect(wrapper.find('[name="Harvested data"]')).toExist()
  })

  it('should render the filterbar', () => {
    const props = { ...initialProps }
    const wrapper = shallow(<PageInspect {...props} />)
    expect(wrapper.find(FilterBar)).toExist()
  })

  it('should dispatch an action on filter change', () => {
    const mockCallback = jest.fn()
    const props = { ...initialProps, dispatch: mockCallback }
    const wrapper = shallow(<PageInspect {...props} />)
    wrapper.instance().filterChanged('foo')
    expect(mockCallback).toHaveBeenCalled()
    expect(mockCallback).toHaveBeenCalledWith({ type: 'UI_INSPECT_UPDATE_FILTER', value: 'foo' })
  })

  describe('Current definition section', () => {
    const getMessage = x => x.find('[name="Current definition"] .placeholder-message')

    it('should render a loading message', () => {
      const props = { ...initialProps, definition: { isFetching: true } }
      const wrapper = shallow(<PageInspect {...props} />)
      expect(getMessage(wrapper)).toIncludeText('Loading the Current definition')
    })

    it('should render an error message', () => {
      const props = { ...initialProps, definition: { error: { state: 500 } } }
      const wrapper = shallow(<PageInspect {...props} />)
      expect(getMessage(wrapper)).toIncludeText('There was a problem loading the Current definition')
    })

    it('should prompt to search for components', () => {
      const wrapper = shallow(<PageInspect {...initialProps} />)
      expect(getMessage(wrapper)).toIncludeText('Search for some part of a component name to see details')
    })

    it('should render no definition message', () => {
      const props = { ...initialProps, definition: { isFetching: false, isFetched: true } }
      const wrapper = shallow(<PageInspect {...props} />)
      expect(getMessage(wrapper)).toIncludeText('There are no Current definition')
    })

    it('should render the editor', () => {
      const props = { ...initialProps, definition: { isFetching: false, isFetched: true, item: {} } }
      const wrapper = shallow(<PageInspect {...props} />)
      expect(wrapper.find(MonacoEditorWrapper)).toExist()
    })
  })
})
