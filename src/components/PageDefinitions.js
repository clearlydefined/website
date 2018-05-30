// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ROUTE_DEFINITIONS, ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'
import { getDefinitionsAction } from '../actions/definitionActions'
import { curateAction } from '../actions/curationActions'
import { FilterBar, ComponentList, Section, FacetSelect, ContributePrompt } from './'
import { uiNavigation, uiBrowseUpdateList, uiBrowseUpdateFilterList } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'
import { set, get, find } from 'lodash'

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
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.doContribute = this.doContribute.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(uiNavigation({ to: ROUTE_DEFINITIONS }))
  }

  onAddComponent(value, after = null) {
    const { dispatch, token, definitions } = this.props
    const component = typeof value === 'string' ? EntitySpec.fromPath(value) : value
    const path = component.toPath()
    !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
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

  hasChanges() {
    const { components } = this.props
    return components && components.list.some(entry => this.hasChange(entry))
  }

  hasChange(entry) {
    return entry.changes && Object.getOwnPropertyNames(entry.changes).length
  }

  doContribute(description) {
    const { dispatch, token, components } = this.props
    const patches = this.buildSpecs(components.list)
    const spec = { description: description, patches }
    dispatch(curateAction(token, spec))
  }

  buildSpecs(list) {
    return list.reduce((result, component) => {
      if (!this.hasChange(component)) return
      const coord = EntitySpec.asRevisionless(component)
      const patch = find(result, p => { return EntitySpec.isEquivalent(p.coordinates, coord) })
      const revisionNumber = component.revision
      if (patch) {
        patch.revisions[revisionNumber] = component.changes
      } else {
        const newPatch = { coordinates: coord, revisions: { [revisionNumber]: component.changes } }
        result.push(newPatch)
      }
      return result
    }, [])
  }

  doPromptContribute(proposal) {
    if (!this.hasChanges()) return
    this.refs.contributeModal.open()
  }

  facetChange(value) {
    const activeFacets = (value || []).map(facet => facet.value)
    this.setState({ ...this.state, activeFacets })
  }

  noRowsRenderer() {
    return <div>Select components from the list above ...</div>
  }

  renderContributeButton() {
    return (
      <Button bsStyle="success" className="pull-right" disabled={!this.hasChanges()} onClick={this.doPromptContribute}>
        Contribute
      </Button>
    )
  }

  render() {
    const { components, filterOptions, definitions, token } = this.props
    const { activeFacets } = this.state
    return (
      <Grid className="main-container">
        <ContributePrompt ref="contributeModal" actionHandler={this.doContribute} />
        <Row className="show-grid spacer">
          <Col md={5}>
            <FacetSelect name="facets" onChange={this.facetChange} defaultFacets={defaultFacets} />
          </Col>
          <Col md={7}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} clearOnChange />
          </Col>
        </Row>
        <Section name={'Available definitions'} actionButton={this.renderContributeButton()}>
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
