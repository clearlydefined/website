// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'

class PageComponents extends Component {

  render() {
    return (
      <Grid className='main-container'>
        <Row className='show-grid'>
          <Col md={4} >
          </Col>
          <Col md={8}>
          The list of compoenents and a component filter etc will be here.
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageComponents)