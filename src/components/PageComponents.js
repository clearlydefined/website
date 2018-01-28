// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { ROUTE_COMPONENTS } from '../utils/routingConstants'
import { getPackageListAction } from '../actions/packageActions'
import { FilterBar, ComponentList, Section } from './'
import { uiNavigation, uiComponentsUpdateList } from '../actions/ui'
import EntitySpec from '../utils/entitySpec'

class PageComponents extends Component {

  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.filterHandler = this.filterHandler.bind(this)
    this.onAddComponent = this.onAddComponent.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    dispatch(uiNavigation({ to: ROUTE_COMPONENTS }))
    dispatch(getPackageListAction(token))
  }

  filterHandler(spec) {
    // const { dispatch, token, queue } = this.props
  }

  onAddComponent(value) {
    const { dispatch } = this.props
    const component = EntitySpec.fromPath(value)
    dispatch(uiComponentsUpdateList({ add: component }))
  }

  onRemoveComponent(component) {
    this.props.dispatch(uiComponentsUpdateList({ remove: component }))
  }

  onChangeComponent(component, newComponent) {
    this.props.dispatch(uiComponentsUpdateList({ update: component, value: newComponent }))
  }

  onClick(event, thing) {
    const target = event.target
    const activeProvider = target.name
    this.setState({ ...this.state, activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return (
      <ButtonGroup>
        <Button name='github' onClick={this.onClick} active={activeProvider === 'github'}>GitHub</Button>
        <Button name='maven' onClick={this.onClick} active={activeProvider === 'maven'}>Maven</Button>
        <Button name='npm' onClick={this.onClick} active={activeProvider === 'npm'}>NPM</Button>
        <Button name='nuget' onClick={this.onClick} active={activeProvider === 'nuget'}>NuGet</Button>
      </ButtonGroup>
    )
  }

  renderActionButton() {
    return (<Button className='pull-right' bsStyle='success' onClick={this.filterHandler}>Filter</Button>)
  }

  noRowsRenderer() {
    return <div>Select components...</div>
  }

  render() {
    const { components, filterOptions } = this.props
    return (
      <Grid className='main-container'>
        <Row className='show-grid spacer'>
          <Col md={4}>
            {this.renderProviderButtons()}
          </Col>
          <Col md={7}>
            <FilterBar options={filterOptions} onChange={this.onAddComponent} clearOnChange />
          </Col>
        </Row>
        <Section name={'Known components'} actionButton={this.renderActionButton()}>
          <div className='section-body'>
            <ComponentList
              list={components}
              listHeight={1000}
              noRowsRenderer={this.noRowsRenderer} />
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
    filterOptions: state.package.list,
    components: state.ui.components.componentList
  }
}
export default connect(mapStateToProps)(PageComponents)