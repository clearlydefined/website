// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'
import { ROUTE_ABOUT } from '../utils/routingConstants'
import { Clearly } from './'

import { primaryColor, secureColor, licensedColor, describedColor } from './Clearly'

import microsoft from '../images/partner-logos/microsoft.png'
import nexb from '../images/partner-logos/nexB.png'
import here from '../images/partner-logos/HERE.png'
import aws from '../images/partner-logos/AWS_logo_RGB.png'
import eclipse from '../images/partner-logos/Eclipse.jpg'
import osi from '../images/partner-logos/osi_standard_logo.png'
import qualcomm from '../images/partner-logos/qualcomm.jpg'
import swh from '../images/partner-logos/swh.png'
import sap from '../images/partner-logos/sap.png'
import webyourmind from '../images/partner-logos/wym.png'
import google from '../images/partner-logos/google.png'
import codescoop from '../images/partner-logos/codescoop.png'

import described from '../images/described-logo.svg'
import secure from '../images/secure-logo.svg'
import licensed from '../images/licensed-logo.svg'
const use = 'sign-out-alt'
const contribute = 'sign-in-alt'
const adopt = 'toggle-on'

const clearlyDefined = <Clearly>Defined</Clearly>

const logoColWidth = 3
const textColWidth = 9

class PageAbout extends Component {
  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ABOUT }))
  }

  renderNeighborhood(name) {
    return (
      <div className="neighborhood-icon">
        <i className={`fas fa-${name}`} />
      </div>
    )
  }

  renderLogo(logo) {
    return (
      <div className="text-center">
        <img className="neighborhood-logo" src={logo} alt="logo" />
      </div>
    )
  }

  render() {
    return (
      <Grid className="main-container about-container">
        <Row className="show-grid neighborhood-row">
          <Col md={12}>
            <h2>About {clearlyDefined}</h2>
            <p>
              {clearlyDefined} and our parent organization, the{' '}
              <a href="https://opensource.org">Open Source Initiative</a>, are on a mission to help FOSS projects thrive
              by being, well, clearly defined. Lack of clarity around licenses and security vulnerabilities reduces
              engagement &mdash; that means fewer users, fewer contributors and a smaller community.
            </p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={logoColWidth} xsPush={textColWidth} smPush={0} className="valign-child">
            {this.renderLogo(described)}
          </Col>
          <Col xs={textColWidth} xsPull={logoColWidth} smPull={0}>
            <h2>
              <Clearly style={describedColor}>Described</Clearly>
            </h2>
            <p>
              Knowing simple things like the source location for the open source component you are using enables
              contribution of docs, bug fixes, or new features. It also inspires confidence by enabling IP and security
              code scans, and source code archiving and disclosure. Round that out with project and issue tracking site
              info, and you have a sound basis for engagement.{' '}
              <a href="https://docs.clearlydefined.io/clearly#described" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={logoColWidth} xsPush={textColWidth} smPush={0} className="valign-child">
            {this.renderLogo(licensed)}
          </Col>
          <Col xs={textColWidth} xsPull={logoColWidth} smPull={0}>
            <h2>
              <Clearly style={licensedColor}>Licensed</Clearly>
            </h2>
            <p>
              Defining and knowing the license for an open source component is essential to a successful partnership.
              Communities choose a license with terms they like. {clearlyDefined} helps clarify that choice and enables
              consumers to follow the terms by identifying key data such as license set, attribution parties, and code
              location.{' '}
              <a href="https://docs.clearlydefined.io/clearly#licensed" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={logoColWidth} xsPush={textColWidth} smPush={0} className="valign-child">
            {this.renderLogo(secure)}
          </Col>
          <Col xs={textColWidth} xsPull={logoColWidth} smPull={0}>
            <h2>
              <Clearly style={secureColor}>Secure</Clearly>
            </h2>
            <p>
              Teams working hard to create quality, secure free and open source components need a simple way of
              recording security issues they find and fix. Bug report and pull requests are great. CVEs and global
              notifications are even better. It can still be hard to relate that data to the components you use.{' '}
              {clearlyDefined} gives communities a security forum that builds confidence and makes for even more
              collaboration.{' '}
              <a href="https://docs.clearlydefined.io/clearly#secure" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={textColWidth}>
            <h2 style={primaryColor}>Get {clearlyDefined}</h2>
            <p>
              Becoming {clearlyDefined} means identifying the information others need, but in your terms. The{' '}
              {clearlyDefined} community meets you where you are to enable automated discovery of your essential data.
              In many cases it's as easy as adding a few properties to a package manifest or dropping a simple file in
              your code repo.{' '}
              <a href="https://docs.clearlydefined.io/adopting" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
          <Col xs={logoColWidth} className="valign-child">
            {this.renderNeighborhood(adopt)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={textColWidth}>
            <h2 style={primaryColor}>Use definitions</h2>
            <p>
              {clearlyDefined} harvests and curates key data about projects from around the world and makes it available
              through a simple REST API and web user experience. Use the data when picking components. Use it to enable
              more collaboration with other project. Use the data to simplify your compliance efforts.{' '}
              <a href="https://docs.clearlydefined.io/using-data" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
          <Col xs={logoColWidth} className="valign-child">
            {this.renderNeighborhood(use)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col xs={textColWidth}>
            <h2 style={primaryColor}>Contribute or curate data</h2>
            <p>
              {clearlyDefined} is a community approach to a community challenge. If you've ever had to figure out where
              source is, or what license is being used, you can contribute to {clearlyDefined}. Add new data, curate
              data provided by others. It's an open source community like any other.{' '}
              <a href="https://docs.clearlydefined.io/contributing-data" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </p>
          </Col>
          <Col xs={logoColWidth} className="valign-child">
            {this.renderNeighborhood(contribute)}
          </Col>
        </Row>

        <Row className="show-grid neighborhood-row">
          <Col md={12}>
            <h2>Community challenge = community solution</h2>

            <p>The goals of {clearlyDefined} are to:</p>
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
              employing external tools and services to do this task. {clearlyDefined} seeks to help projects be more
              clear from the beginning. It provides a mechanism for harvesting available data using tools such as{' '}
              <a href="https://github.com/nexB/scancode-toolkit">ScanCode</a> and{' '}
              <a href="https://www.fossology.org/">FOSSology</a>, and facilitates crowd-sourcing the curation of that
              information when ambiguities or gaps arise. The ultimate goal of harvesting and curation is to contribute
              any new-found clarity (e.g., new licenses found) to the upstream projects so they can include the updates
              in their next release &mdash; thus becoming more clearly defined. Everyone wins.
            </p>
            <p>
              Right now the focus is on clarifying an individual project’s license, source code location, and copyright
              holders &mdash; all the essentials for engaging with a project. Going forward, we see security,
              accessibility, and internationalization being important parts of the {clearlyDefined} ecosystem.
            </p>
            <h3>Get involved</h3>
            <p>
              It’s still very early days and we don’t have all the answers. {clearlyDefined} is still being defined. You
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
            <p>We'd love to hear how you want to get involved in {clearlyDefined}!</p>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col>
            <h2>Partners</h2>
            <p>&nbsp;</p>
            <p>
              We are proud to be a have a growing list of partners from across the free and open source software
              ecosystem &mdash; from foundations to initiatives to small and large scale companies across a broad
              spectrum of industries. You too can be on this list! See some of the many{' '}
              <a href="https://github.com/clearlydefined/clearlydefined/wiki/Get-Involved">ways to get involved</a>.
            </p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={aws} width="120" className="about-image" alt="aws" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={eclipse} width="200" className="about-image" alt="eclipse" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={nexb} width="140" className="about-image" alt="nexb" />
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={here} width="130" className="about-image" alt="here" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={microsoft} width="220" className="about-image" alt="microsoft" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={osi} width="120" className="about-image" alt="osi" />
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={qualcomm} width="190" className="about-image" alt="qualcomm" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={swh} width="240" className="about-image" alt="swh" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={sap} width="160" className="about-image" alt="sap" />
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={webyourmind} width="190" className="about-image" alt="webyourmind" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={google} width="220" className="about-image" alt="google" />
            </div>
          </Col>
          <Col md={3} sm={4} xs={12} className="center-block">
            <div className="about-cell">
              <img src={codescoop} width="220" className="about-image" alt="codescoop" />
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
