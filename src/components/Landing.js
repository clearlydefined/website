// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

const described = 'vcard'
const secure = 'lock'
const licensed = 'file-code-o'
const use = 'sign-out'
const contribute = 'sign-in'
const adopt = 'toggle-on'

export default class Landing extends Component {

  renderNeighborhood(name) {
    return (
      <div className="neighborhood-icon">
        <FontAwesome name={name} />
      </div>
    )
  }

  render() {
    return (
      <Grid className="main-container">
        <Jumbotron>
          <h1>ClearlyDefined</h1>
          <p>&nbsp;</p>
          <p> Enabling free and open source project success by simplifying consumption. </p>
          <p>Are you ClearlyDefined?</p>
        </Jumbotron>


        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(described)}
          </Col>
          <Col md={8}>
            <h2>ClearlyDescribed</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(licensed)}
          </Col>
          <Col md={8}>
            <h2>ClearlyLicensed</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(secure)}
          </Col>
          <Col md={8}>
            <h2>ClearlySecure</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(adopt)}
          </Col>
          <Col md={8}>
            <h2>Get ClearlyDefined</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(use)}
          </Col>
          <Col md={8}>
            <h2>Use definitions</h2>
            <h3>
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
              This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            This is a bunch of text about this topic. This is a bunch of text about this topic. This is a bunch of text about this topic.
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(contribute)}
          </Col>
          <Col md={8}>
            <h2>Contribute or curate definitions</h2>
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
