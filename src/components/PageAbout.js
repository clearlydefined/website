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
            <h4>
              We're on a mission to help FOSS projects thrive by being, well, clearly defined. Lack of clarity around
               licenses and security vulnerabilities reduces engagement -- that means fewer users, fewer contributors and a
               smaller community. This is a community-wide challenge and we're taking a community-wide approach. We want to:

              <ul className="list-unstyled">
                <li>Raise awareness within FOSS project teams</li>
                <li>Make it easy to identify and supply missing information</li>
                <li>Automatically harvest data from projects</li>
                <li>Crowd-source the curation that data</li>
                <li>Feed the curation work back to the original projects</li>
              </ul>

              Large-scale FOSS consumers often struggle to fully gather basic things like the license for a component, the source
               location (e.g., Git commit) for a version, details to be included in attributions (e.g, copyright holders in a
               Notices file). The net result is that projects lacking clarity on these points regularly face significant friction
               in the FOSS consumers’ internal processes ultimately affecting project engagement. Everyone loses.

              To date, most people are paying vendors for tools incurring expenses to vet FOSS either through repetitive,
               duplicative efforts or through employing external services to do this task. ClearlyDefined seeks to help FOSS
               projects be more clear from the beginning. It provides a mechanism for harvesting available data using tools
               like ScanCode, Fossology, and others, at scale and facilitates crowd-sourcing the curation of that information
               when ambiguities or gaps arise in the metadata. The ultimate goal of harvesting and curation is to contribute
               any new-found clarity (e.g, new licenses found) to the upstream projects so they can include that info in their
               next release -- thus becoming more clearly defined. Everyone wins.

              We are currently focused on license, source code location, and copyright holders, but going forward, we see
               security, accessibility, and internationalization all being important parts of the ClearlyDefined ecosystem. If
               you are excited about these things, we encourage you to reach out and get engaged to help us drive those conversations.

              You can participate in the Clearly Defined effort in <a href="https://github.com/clearlydefined/clearlydefined/wiki/Get-Involved">
              several different ways</a>.

              You can find us at <a href="https://clearlydefined.io">clearlydefined.io</a>, and
               on <a href="https://github.com/clearlydefined">github.com/clearlydefined</a>. You
               can also email us at <a href="mailto:#">clearlydefined@googlegroups.com</a>. We’d love to hear how you want to
               contribute to ClearlyDefined!

              You can also read over our <a href="https://github.com/clearlydefined/clearlydefined/wiki/FAQs">FAQs</a>.
          </h4>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={1}>
          </Col>
          <Col md={10}>
            <h2>Sponsors</h2>
            <h3>
              TBA
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
