// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import { getPackageListAction, getPackageAction } from '../actions/packageActions'
import { getCurationAction } from '../actions/curationActions'
import { getHarvestResultsAction } from '../actions/harvestActions'
import { uiUpdateFilter, uiNavigation } from '../actions/ui'
import { FilterBar, MonacoEditorWrapper } from './'
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
    const { dispatch, token, filterValue, path } = this.props
    this.handleNewSpec(path)
    dispatch(uiNavigation({ to: ROUTE_COMPONENTS }))
    dispatch(getPackageListAction(token, filterValue))
  }

  componentWillReceiveProps(newProps) {
    // If the spec is changing, kick off some loading to get all the state in order
    const newPath = newProps.path
    if (newPath && this.props.path !== newPath)
      this.handleNewSpec(newPath)
  }

  handleNewSpec(path) {
    if (!path)
      return
    const { dispatch, token } = this.props
    dispatch(uiUpdateFilter(path))
    const spec = EntitySpec.fromPath(path)
    dispatch(getPackageAction(token, spec))
    dispatch(getCurationAction(token, spec))
    dispatch(getHarvestResultsAction(token, spec))
  }

  filterChanged(path) {
    const { dispatch, token } = this.props
    dispatch(uiUpdateFilter(token, path))
    this.gotoValue(path)
  }

  gotoValue(value) {
    this.props.history.push(`${ROUTE_COMPONENTS}${value ? '/' + value : ''}`)
  }

  editorDidMount(editor, monaco) {
    // this.setState({ ...this.state, editor: editor })
    // editor.focus()
  }

  renderMissing(value) {
    return (
      <Button>Queue harvest</Button>
    )
  }

  renderTitle(name, actionButton = null) {
    const Name = name.charAt(0).toUpperCase() + name.slice(1)
    return (
      <Row className='section-header'>
        <Col sm={10}>
          <div className='section-title'>{Name}</div>
        </Col>
        <Col sm={2}>
          <div className='section-button'>{actionButton}</div>
        </Col>
      </Row>)
  }

  renderData(value, name, type = 'json', actionButton = null) {
    return (
      <div>
        {this.renderTitle(name, actionButton)}
        {this.renderInnerData(value, name, type, actionButton)}
      </div>)
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
      <div className='placeholder-message inline placeholder-wrapper'>
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
          <FilterBar options={filterOptions} value={filterValue} onChange={this.filterChanged} />
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
    filterValue: state.ui.filter.value,
    filterOptions: state.package.list,
    component: state.package.current,
    curation: state.curation.current,
    harvest: state.harvest.current
  }
}
export default connect(mapStateToProps)(PageComponents)