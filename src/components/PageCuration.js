// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { MonacoHarvestForm } from './'
import { harvestAction } from '../actions/harvestActions'

class PageCuration extends Component {

  constructor(props) {
    super(props)
    this.harvestHandler = this.harvestHandler.bind(this)
  }

  harvestHandler(spec) {
    const { dispatch, token } = this.props
    dispatch(harvestAction(token, spec))
  }

  render() {
    return (
      <Grid className="main-container">
        <Row className="show-grid">
          <Col md={4} >
          </Col>
          <Col md={8}>
            <MonacoHarvestForm harvestHandler={this.harvestHandler} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageCuration)