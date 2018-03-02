// Copyright (c) Microsoft Corporation and others.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import { getDefinitionListAction } from '../actions/definitionActions'
import { uiInspectUpdateFilter, uiNavigation, uiInspectGetCuration, uiInspectGetHarvested, uiInspectGetDefinition } from '../actions/ui'
import { FilterBar, MonacoEditorWrapper, Section } from './'
import EntitySpec from '../utils/entitySpec';
import { ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants';

class PageInspect extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.filterChanged = this.filterChanged.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
    this.addCuration = this.addCuration.bind(this)
  }

  componentDidMount() {
    const { dispatch, token, path, filterValue } = this.props
    const pathToShow = path || filterValue
    this.handleNewSpec(pathToShow)
    dispatch(uiNavigation({ to: ROUTE_INSPECT }))
    dispatch(getDefinitionListAction(token))
  }

  componentWillReceiveProps(newProps) {
    // if the path is changing, update the filter to match. That will trigger getting the content
    const newPath = newProps.path
    if (this.props.path !== newPath)
      return this.filterChanged(newPath)

    // if the filter is changing (either on its own or because of the path), get the new content
    const newFilter = newProps.filterValue
    if (this.props.filterValue !== newFilter)
      this.handleNewSpec(newFilter)
  }

  handleNewSpec(newFilter) {
    const { dispatch, token } = this.props
    if (!newFilter) {
      // TODO clear out the "current" values as we are not showing anything.
      return
    }
    const spec = EntitySpec.fromPath(newFilter)
    dispatch(uiInspectGetDefinition(token, spec))
    dispatch(uiInspectGetCuration(token, spec))
    dispatch(uiInspectGetHarvested(token, spec))
  }

  addCuration() {
    const url = `${ROUTE_CURATE}/${this.props.filterValue}`
    this.props.history.push(url)
  }

  filterChanged(newFilter) {
    this.props.dispatch(uiInspectUpdateFilter(newFilter))
  }

  gotoValue(value) {
    this.props.history.push(`${ROUTE_INSPECT}${value ? `/${value}` : ''}`)
  }

  editorDidMount(editor, monaco) {
    this.setState({ ...this.state, editor: editor })
    editor.focus()
  }

  renderMissing(value) {
    return (
      <Button>Queue harvest</Button>
    )
  }

  renderData(value, name, type = 'json', actionButton = null) {
    return (
      <Section name={name} actionButton={actionButton}>
        {this.renderInnerData(value, name, type, actionButton)}
      </Section>)
  }

  renderInnerData(value, name, type = 'json', actionButton = null) {
    if (value.isFetching)
      return this.renderPlaceholder(`Loading the ${name}`)
    if (value.error && !value.error.state === 404)
      return this.renderPlaceholder(`There was a problem loading the ${name}`)
    if (!value.isFetched)
      return this.renderPlaceholder('Search for some part of a component name to see details')
    if (!value.item)
      return this.renderPlaceholder(`There are no ${name}`, actionButton)
    const options = {
      selectOnLineNumbers: true
    }
    return (
      <MonacoEditorWrapper
        height='400'
        language={type}
        value={value.transformed}
        options={options}
        editorDidMount={this.editorDidMount}
      />)
  }

  renderPlaceholder(message) {
    return (
      <div className='placeholder-message inline section-body'>
        <span>{message}</span>
      </div>)
  }

  renderCurationButton() {
    return (
      <Button
        bsStyle='success'
        className='pull-right'
        disabled={!Boolean(this.props.filterValue)}
        onClick={this.addCuration}>Add curation
      </Button>
    )
  }

  renderHarvestButton() {
    return (<Button bsStyle='success' className='pull-right'>Harvest data</Button>)
  }

  render() {
    const { filterOptions, filterValue, definition, curation, harvest, path } = this.props
    return (
      <Grid className='main-container'>
        <Row className="show-grid spacer">
          <Col md={10} mdOffset={1}>
            <FilterBar
              options={filterOptions}
              value={path || filterValue}
              onChange={this.filterChanged} />
          </Col>
        </Row>
        <Row className='show-grid'>
          {this.renderData(definition, 'Current definition', 'yaml', this.renderCurationButton())}
          {this.renderData(curation, 'Curations', 'json', this.renderCurationButton())}
          {this.renderData(harvest, 'Harvested data', 'json', this.renderHarvestButton())}
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    filterValue: state.ui.inspect.filter,
    filterOptions: state.definition.list,
    definition: state.ui.inspect.definition,
    curation: state.ui.inspect.curation,
    harvest: state.ui.inspect.harvested
  }
}

export default connect(mapStateToProps)(PageInspect)
