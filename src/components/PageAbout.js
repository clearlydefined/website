// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'
import { ROUTE_ABOUT } from '../utils/routingConstants'
import { Clearly } from './'

import microsoft from '../images/partner-logos/microsoft.png'
import nexb from '../images/partner-logos/nexB.png'
import here from '../images/partner-logos/HERE.png'
import aws from '../images/partner-logos/AWS_logo_RGB.png'
import eclipse from '../images/partner-logos/Eclipse.jpg'
import osi from '../images/partner-logos/osi_standard_logo.png'
import qualcomm from '../images/partner-logos/qualcomm.jpg'
import swh from '../images/partner-logos/swh.png'
import sap from '../images/partner-logos/sap.png'

const clearlyDefined = <Clearly>Defined</Clearly>

class PageAbout extends Component {
  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ABOUT }))
  }

  render() {
    return (
      <Grid className="main-container">
        <Row className="show-grid neighborhood-row about-text">
          <Col md={10} mdOffset={1}>
            <h2>About {clearlyDefined}</h2>
            <p>&nbsp;</p>
            <p>
              ClearlyDefined and our parent organization, the{' '}
              <a href="https://opensource.org">Open Source Initiative</a>, are on a mission to help FOSS projects thrive
              by being, well, clearly defined. Lack of clarity around licenses and security vulnerabilities reduces
              engagement -- that means fewer users, fewer contributors and a smaller community.
            </p>
            <div style={{ textAlign: 'center' }}>
              <p>
                <b>This is a community-wide challenge that needs a community-wide approach.</b>
              </p>
            </div>

            <p>As such, the goals of the project are to:</p>
            <ul className="list-style-type:square">
              <li> Raise awareness about this challenge within FOSS project teams</li>
              <li> Automatically harvest data from projects</li>
              <li> Make it easy for anyone to contribute missing information</li>
              <li> Crowd-source the curation of these contributions</li>
              <li> Feed curated contributions back to the original projects</li>
            </ul>

            <p>
              FOSS consumers often struggle to find basic things like the license for a component, the source location
              (e.g., Git commit) for a version, and details to be included in attributions (e.g., copyright holders in a
              Notices file). These ambiguities make projects hard to consume. Projects that are hard to consume get less
              engagement. Everyone loses.
            </p>
            <p>
              To date, most people are: ignoring the problem, vetting FOSS through repetitive, duplicative efforts, or
              employing external tools and services to do this task. ClearlyDefined seeks to help projects be more clear
              from the beginning. It provides a mechanism for harvesting available data using tools such as{' '}
              <a href="https://github.com/nexB/scancode-toolkit">ScanCode</a> and{' '}
              <a href="https://www.fossology.org/">FOSSology</a>, and facilitates crowd-sourcing the curation of that
              information when ambiguities or gaps arise. The ultimate goal of harvesting and curation is to contribute
              any new-found clarity (e.g., new licenses found) to the upstream projects so they can include the updates
              in their next release -- thus becoming more clearly defined. Everyone wins.
            </p>
            <p>
              Right now the focus is on clarifying an individual project’s license, source code location, and copyright
              holders -- all the essentials for engaging with a project. Going forward, we see security, accessibility,
              and internationalization being important parts of the ClearlyDefined ecosystem.
            </p>
            <h3>Get involved</h3>
            <p>
              It’s still very early days and we don’t have all the answers. ClearlyDefined is still being defined. You
              can help. Come design the processes, make decisions, connect with projects, and build the community. Find
              out more about <a href="https://docs.clearlydefined.io/get-involved">how to get involved</a>.
            </p>
            <p>You can find us at:</p>
            <ul style={{ listStyleType: 'none' }}>
              <li>
                <i className="fab fa-github" /> &nbsp;&nbsp;
                <a href="https://github.com/clearlydefined/clearlydefined">GitHub</a>
              </li>
              <li>
                <i className="fab fa-discord" /> &nbsp;&nbsp;
                <a href="https://discord.gg/wEzHJku">Discord</a>
              </li>
              <li>
                <i className="fab fa-twitter" /> &nbsp;&nbsp;
                <a href="https://twitter.com/clearlydefd">Twitter</a>
              </li>
              <li>
                <i className="fa fa-envelope" /> &nbsp;&nbsp;
                <a href="mailto:clearlydefined@googlegroups.com">clearlydefined@googlegroups.com</a>
              </li>
            </ul>
            <p>We'd love to hear how you want to get involved in ClearlyDefined!</p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row about-text">
          <Col md={10} mdOffset={1}>
            <h2>Partners</h2>
            <p>&nbsp;</p>
            <p>
              We are proud to be a have a growing list of partners from across the free and open source software
              ecosystem -- from foundations to initiatives to small and large scale companies across a broad spectrum of
              industries. You too can be on this list! See some of the many{' '}
              <a href="https://github.com/clearlydefined/clearlydefined/wiki/Get-Involved">ways to get involved</a>.
            </p>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col md={3} mdOffset={2}>
            <div className="about-cell">
              <img src={aws} width="120" className="about-image" alt="aws" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={eclipse} width="200" className="about-image" alt="eclipse" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={nexb} width="140" className="about-image" alt="nexb" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3} mdOffset={2}>
            <div className="about-cell">
              <img src={here} width="130" className="about-image" alt="here" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={microsoft} width="220" className="about-image" alt="microsoft" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={osi} width="120" className="about-image" alt="osi" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3} mdOffset={2}>
            <div className="about-cell">
              <img src={qualcomm} width="190" className="about-image" alt="qualcomm" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={swh} width="240" className="about-image" alt="swh" />
            </div>
          </Col>
          <Col md={3}>
            <div className="about-cell">
              <img src={sap} width="160" className="about-image" alt="sap" />
            </div>
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
