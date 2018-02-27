// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'
import { ROUTE_ABOUT } from '../utils/routingConstants'

class PageAbout extends Component {

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ABOUT }))
  }

  render() {
    return (
      <Grid className="main-container">
        <Row className="show-grid neighborhood-row">
          <Col md={1}>
          </Col>
          <Col md={10}>
            <h2>About ClearlyDefined</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
          </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={1}>
          </Col>
          <Col md={10}>
            <h2>Sponsors</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageAbout)