// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap'

export default class PageAbout extends Component {

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
