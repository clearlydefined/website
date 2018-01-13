// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row } from 'react-bootstrap'
import { ROUTE_HARVEST } from '../utils/routingConstants'
import { harvestAction } from '../actions/harvestActions'
import { HarvestForm } from './'
import { uiNavigation } from '../actions/ui'

class PageHarvest extends Component {

  constructor(props) {
    super(props)
    this.harvestHandler = this.harvestHandler.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_HARVEST }))
  }

  harvestHandler(spec) {
    const { dispatch, token } = this.props
    dispatch(harvestAction(token, spec))
  }

  render() {
    return (
      <Grid className='main-container'>
        <Row className='show-grid'>
          <HarvestForm harvestHandler={this.harvestHandler} />
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageHarvest)