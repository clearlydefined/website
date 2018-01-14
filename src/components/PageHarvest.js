// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { ROUTE_HARVEST } from '../utils/routingConstants'
import { harvestAction } from '../actions/harvestActions'
import { HarvestForm, GitHubSelector } from './'
import { uiNavigation, uiHarvestUpdateFilter } from '../actions/ui'

class PageHarvest extends Component {

  constructor(props) {
    super(props)
    this.harvestHandler = this.harvestHandler.bind(this)
    this.onChange = this.onChange.bind(this)
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

  render() {
    return (
      <Grid className='main-container'>
        <Row className='show-grid spacer'>
          <Col md={10} mdOffset={1}>
            <GitHubSelector onChange={this.onChange}
            />
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