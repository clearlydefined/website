// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { ROUTE_HARVEST } from '../utils/routingConstants'
import { harvestAction } from '../actions/harvestActions'
import { HarvestForm, GitHubSelector, NpmSelector, MavenSelector } from './'
import { uiNavigation, uiHarvestUpdateFilter } from '../actions/ui'

class PageHarvest extends Component {

  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.harvestHandler = this.harvestHandler.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_HARVEST }))
  }

  harvestHandler(spec) {
    const { dispatch, token } = this.props
    dispatch(harvestAction(token, spec))
  }

  onChange(value) {
    this.props.dispatch(uiHarvestUpdateFilter(value))
  }

  onClick(event, thing) {
    const target = event.target
    const activeProvider = this.state.activeProvider === target.name ? null : target.name
    this.setState({ ...this.state, activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return (
      <ButtonGroup>
        <Button name='github' onClick={this.onClick} active={activeProvider === 'github'}>GitHub</Button>
        <Button name='npm' onClick={this.onClick} active={activeProvider === 'npm'}>NPM</Button>
        <Button name='maven' onClick={this.onClick} active={activeProvider === 'maven'}>Maven</Button>
      </ButtonGroup>
    )
  }

  render() {
    const { activeProvider } = this.state
    return (
      <Grid className='main-container'>
        <Row className='show-grid spacer'>
          <Col md={3} mdOffset={1}>
            {this.renderProviderButtons()}
          </Col>
          <Col md={7}>
            {activeProvider === 'github' && <GitHubSelector onChange={this.onChange} />}
            {activeProvider === 'npm' && <NpmSelector onChange={this.onChange} />}
            {activeProvider === 'maven' && <MavenSelector onChange={this.onChange} />}
          </Col>
        </Row>
        <HarvestForm harvestHandler={this.harvestHandler} />
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
  }
}
export default connect(mapStateToProps)(PageHarvest)