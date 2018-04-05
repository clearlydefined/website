// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { ROUTE_DEFINITIONS, ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'
import { getDefinitionsAction } from '../actions/definitionActions'
import { FilterBar, ComponentList, Section, FacetSelect } from './'
import { uiNavigation, uiBrowseUpdateList, uiBrowseUpdateFilterList } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'

const defaultFacets = [{ value: 'core', label: 'Core' }]

class PageDefinitions extends Component {
  constructor(props) {
    super(props)
    this.state = { activeFacets: defaultFacets.map(x => x.value) }
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onInspect = this.onInspect.bind(this)
    this.onCurate = this.onCurate.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.facetChange = this.facetChange.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  onAddComponent(value, after = null) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    component.definition = !!definitions.entries[path]
    !component.definition && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  onSearch(value) {
    const { dispatch, token } = this.props
    dispatch(uiBrowseUpdateFilterList(token, value))
  }

  onCurate(component) {
    const url = `${ROUTE_CURATE}/${component.toPath()}`
    this.props.history.push(url)
  }

  onInspect(component) {
    const url = `${ROUTE_INSPECT}/${component.toPath()}`
    this.props.history.push(url)
  }

  onRemoveComponent(component) {
    this.props.dispatch(uiBrowseUpdateList({ remove: component }))
  }

  onChangeComponent(component, newComponent) {
    this.props.dispatch(uiBrowseUpdateList({ update: component, value: newComponent }))
  }

  facetChange(value) {
    const activeFacets = (value || []).map(facet => facet.value)
    this.setState({ ...this.state, activeFacets })
  }

  noRowsRenderer() {
    return <div>Select components from the list above ...</div>
  }

  render() {
    const { components, filterOptions, definitions, token } = this.props
    const { activeFacets } = this.state
    return (
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <Col md={5}>
            <FacetSelect name="facets" onChange={this.facetChange} defaultFacets={defaultFacets} />
          </Col>
          <Col md={7}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} clearOnChange />
          </Col>
        </Row>
        <Section name={'Available definitions'}>
          <div className="section-body">
            <ComponentList
              list={components}
              listHeight={1000}
              onRemove={this.onRemoveComponent}
              onChange={this.onChangeComponent}
              onAddComponent={this.onAddComponent}
              onInspect={this.onInspect}
              onCurate={this.onCurate}
              definitions={definitions}
              githubToken={token}
              noRowsRenderer={this.noRowsRenderer}
              activeFacets={activeFacets}
            />
          </div>
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageDefinitions)
