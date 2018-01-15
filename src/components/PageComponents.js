// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import { getPackageListAction, getPackageAction } from '../actions/packageActions'
import { getCurationAction } from '../actions/curationActions'
import { getHarvestResultsAction } from '../actions/harvestActions'
import { uiBrowseUpdateFilter, uiNavigation } from '../actions/ui'
import { FilterBar, MonacoEditorWrapper, Section } from './'
import EntitySpec from '../utils/entitySpec';
import { ROUTE_COMPONENTS } from '../utils/routingConstants';

class PageComponents extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.filterChanged = this.filterChanged.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
  }

  componentDidMount() {
    const { dispatch, token, path, filterValue } = this.props
    const pathToShow = path ? path : filterValue
    this.handleNewSpec(pathToShow)
    dispatch(uiNavigation({ to: ROUTE_COMPONENTS }))
    dispatch(getPackageListAction(token))
  }

  componentWillReceiveProps(newProps) {
    // if the path is changing, update the filter to match. That will trigger getting the content
    const newPath = newProps.path
    if (this.props.path !== newPath)
      return this.props.dispatch(uiBrowseUpdateFilter(newPath))

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
    dispatch(getPackageAction(token, spec))
    dispatch(getCurationAction(token, spec))
    dispatch(getHarvestResultsAction(token, spec))
  }

  filterChanged(newFilter) {
    this.props.dispatch(uiBrowseUpdateFilter(newFilter))
  }

  gotoValue(value) {
    this.props.history.push(`${ROUTE_COMPONENTS}${value ? '/' + value : ''}`)
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
        // theme='vs-dark'
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
    return (<Button bsStyle='success' className='pull-right'>Add curation</Button>)
  }

  renderHarvestButton() {
    return (<Button bsStyle='success' className='pull-right'>Harvest data</Button>)
  }

  render() {
    const { filterOptions, filterValue, component, curation, harvest } = this.props
    return (
      <Grid className='main-container'>
        <Row className="show-grid spacer">
          <Col md={10} mdOffset={1}>
            <FilterBar options={filterOptions} value={filterValue} onChange={this.filterChanged} />
          </Col>
        </Row>
        <Row className='show-grid'>
          {this.renderData(component, 'results', 'yaml', this.renderCurationButton())}
          {this.renderData(curation, 'curations', 'json', this.renderCurationButton())}
          {this.renderData(harvest, 'harvest data', 'json', this.renderHarvestButton())}
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    path: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    filterValue: state.ui.browse.filter,
    filterOptions: state.package.list,
    component: state.package.current,
    curation: state.curation.current,
    harvest: state.harvest.current
  }
}
export default connect(mapStateToProps)(PageComponents)