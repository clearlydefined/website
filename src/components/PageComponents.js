// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { ROUTE_COMPONENTS, ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'
import { getDefinitionListAction, getDefinitionsAction } from '../actions/definitionActions'
import { FilterBar, ComponentList, Section } from './'
import { uiNavigation, uiBrowseUpdateList, uiInspectUpdateFilter, uiCurateUpdateFilter } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'

class PageComponents extends Component {

  constructor(props) {
    super(props)
    this.state = { }
    this.filterHandler = this.filterHandler.bind(this)
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onInspect = this.onInspect.bind(this)
    this.onCurate = this.onCurate.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    dispatch(uiNavigation({ to: ROUTE_COMPONENTS }))
    dispatch(getDefinitionListAction(token))
  }

  filterHandler(spec) {
    // const { dispatch, token, queue } = this.props
  }

  onAddComponent(value, after = null) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    component.definition = !!definitions.entries[path]
    !component.definition && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiBrowseUpdateList({ add: component }))
  }

  onCurate(component) {
    const path = component.toPath();
    const url = `${ROUTE_CURATE}/${path}`
    this.props.history.push(url)
    this.props.dispatch(uiCurateUpdateFilter(path))
  }

  onInspect(component) {
    const path = component.toPath();
    const url = `${ROUTE_INSPECT}/${path}`
    this.props.history.push(url)
    this.props.dispatch(uiInspectUpdateFilter(path))
  }

  onRemoveComponent(component) {
    this.props.dispatch(uiBrowseUpdateList({ remove: component }))
  }

  onChangeComponent(component, newComponent) {
    this.props.dispatch(uiBrowseUpdateList({ update: component, value: newComponent }))
  }

  noRowsRenderer() {
    return <div>Select components from the list above ...</div>
  }

  render() {
    const { components, filterOptions, definitions, token } = this.props
    return (
      <Grid className='main-container'>
        <Row className='show-grid spacer'>
          <Col md={7}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} clearOnChange />
          </Col>
        </Row>
        <Section name={'Available definitions'}>
          <div className='section-body'>
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
    components: state.ui.browse.componentList,
    filterOptions: state.definition.list,
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageComponents)
