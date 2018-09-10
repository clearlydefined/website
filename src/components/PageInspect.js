// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import {
  uiInspectGetCuration,
  uiInspectGetHarvested,
  uiInspectGetDefinition,
  uiInspectUpdateFilterList
} from '../actions/ui'
import { uiNavigation, uiInspectUpdateFilter } from '../actions/ui'
import { FilterBar, MonacoEditorWrapper, Section, CopyUrlButton } from './'
import FileList from './FileList'
import EntitySpec from '../utils/entitySpec'
import { ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'

export class PageInspect extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.filterChanged = this.filterChanged.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
    this.addCuration = this.addCuration.bind(this)
  }

  componentDidMount() {
    const { dispatch, path, filterValue } = this.props
    const pathToShow = path ? path : filterValue
    this.handleNewSpec(pathToShow)
    dispatch(uiNavigation({ to: ROUTE_INSPECT }))
  }

  componentWillReceiveProps(newProps) {
    // if the path is changing, update the filter to match. That will trigger getting the content
    const newPath = newProps.path
    if (this.props.path !== newPath) return this.filterChanged(newPath)

    // if the filter is changing (either on its own or because of the path), get the new content
    const newFilter = newProps.filterValue
    if (this.props.filterValue !== newFilter) this.handleNewSpec(newFilter)
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

  onSearch(value) {
    const { dispatch, token } = this.props
    dispatch(uiInspectUpdateFilterList(token, value))
  }

  gotoValue(value) {
    this.props.history.push(`${ROUTE_INSPECT}${value ? '/' + value : ''}`)
  }

  editorDidMount(editor, monaco) {
    this.setState({ ...this.state, editor: editor })
    editor.focus()
  }

  renderMissing(value) {
    return <Button>Queue harvest</Button>
  }

  renderData(value, name, type = 'json', actionButton = null) {
    return (
      <Section name={name} actionButton={actionButton}>
        {this.renderInnerData(value, name, type, actionButton)}
      </Section>
    )
  }

  renderInnerData(value, name, type = 'json', actionButton = null) {
    const { readOnly } = this.props
    if (value.isFetching) return this.renderPlaceholder(`Loading the ${name}`)
    if (value.error && value.error.state !== 404)
      return this.renderPlaceholder(`There was a problem loading the ${name}`)
    if (!value.isFetched) return this.renderPlaceholder('Search for some part of a component name to see details')
    if (!value.item) return this.renderPlaceholder(`There are no ${name}`)
    const options = {
      selectOnLineNumbers: true,
      readOnly: readOnly
    }
    return (
      <MonacoEditorWrapper
        height="400"
        language={type}
        value={value.transformed}
        options={options}
        editorDidMount={this.editorDidMount}
      />
    )
  }

  renderPlaceholder(message) {
    return (
      <div className="placeholder-message inline section-body">
        <span>{message}</span>
      </div>
    )
  }

  renderCurationButton() {
    return this.props.readOnly ? null : (
      <Button
        bsStyle="success"
        className="pull-right add-curation-btn"
        disabled={!Boolean(this.props.filterValue)}
        onClick={this.addCuration}
      >
        Add curation
      </Button>
    )
  }

  renderHarvestButton() {
    return null
  }

  render() {
    const { filterOptions, filterValue, definition, curation, harvest, path, readOnly } = this.props
    return (
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <Col md={9} mdOffset={1}>
            {readOnly ? null : (
              <FilterBar
                options={filterOptions}
                value={filterValue}
                onChange={this.filterChanged}
                onSearch={this.onSearch}
                defaultValue={path || ''}
              />
            )}
          </Col>
          <Col md={1}>
            {readOnly ? null : <CopyUrlButton route={ROUTE_INSPECT} path={filterValue} bsStyle="default" />}
          </Col>
        </Row>
        <Row className="show-grid">
          {this.renderData(definition, 'Current definition', 'yaml', this.renderCurationButton())}
          {this.renderData(curation, 'Curations', 'json', this.renderCurationButton())}
          {this.renderData(harvest, 'Harvested data', 'json', this.renderHarvestButton())}
          <Section name="FileList View">
            <FileList files={definition.item && definition.item.files} />
          </Section>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const path = ownProps.location.pathname.slice(ownProps.match.url.length + 1)
  return {
    token: state.session.token,
    path,
    readOnly: path.includes('/pr/'),
    filterValue: state.ui.inspect.filter,
    filterOptions: state.ui.inspect.filterList,
    definition: state.ui.inspect.definition,
    curation: state.ui.inspect.curation,
    harvest: state.ui.inspect.harvested
  }
}
export default connect(mapStateToProps)(PageInspect)
