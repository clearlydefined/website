// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { ROUTE_ROOT } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import logo from '../images/logo-text-stacked.svg'
import { Clearly } from './'
import { primaryColor, secureColor, licensedColor, describedColor } from './Clearly'

import described from '../images/described-logo.svg'
import secure from '../images/secure-logo.svg'
import licensed from '../images/licensed-logo.svg'
const use = 'sign-out-alt'
const contribute = 'sign-in-alt'
const adopt = 'toggle-on'

const clearlyDefined = <Clearly>Defined</Clearly>

const logoColWidth = 3
const textColWidth = 9

class PageLanding extends Component {
  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ROOT }))
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
      <div className="neighborhood-logo-container">
        <img className="neighborhood-logo" src={logo} alt="logo" />
      </div>
    )
  }

  render() {
    return (
      <Grid className="main-container">
        <img src={logo} alt="logo" className="landing-large-logo" />
        <Row className="show-grid neighborhood-row">
          <Col md={logoColWidth} className="valign-child">
            {this.renderLogo(described)}
          </Col>
          <Col md={textColWidth}>
            <h2>
              <Clearly style={describedColor}>Described</Clearly>
            </h2>
            <h3>
              Knowing simple things like the source location for the open source component you are using enables
              contribution of docs, bug fixes, or new features. It also inspires confidence by enabling IP and security
              code scans, and source code archiving and disclosure. Round that out with project and issue tracking site
              info, and you have a sound basis for engagement.{' '}
              <a href="https://docs.clearlydefined.io/clearly#described" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={logoColWidth} className="valign-child">
            {this.renderLogo(licensed)}
          </Col>
          <Col md={textColWidth}>
            <h2>
              <Clearly style={licensedColor}>Licensed</Clearly>
            </h2>
            <h3>
              Defining and knowing the license for an open source component is essential to a successful partnership.
              Communities choose a license with terms they like. {clearlyDefined} helps clarify that choice and enables
              consumers to follow the terms by identifying key data such as license set, attribution parties, and code
              location.{' '}
              <a href="https://docs.clearlydefined.io/clearly#licensed" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={logoColWidth} className="valign-child">
            {this.renderLogo(secure)}
          </Col>
          <Col md={textColWidth}>
            <h2>
              <Clearly style={secureColor}>Secure</Clearly>
            </h2>
            <h3>
              Teams working hard to create quality, secure free and open source components need a simple way of
              recording security issues they find and fix. Bug report and pull requests are great. CVEs and global
              notifications are even better. It can still be hard to relate that data to the components you use.{' '}
              {clearlyDefined} gives communities a security forum that builds confidence and makes for even more
              collaboration.{' '}
              <a href="https://docs.clearlydefined.io/clearly#secure" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={textColWidth}>
            <h2 style={primaryColor}>Get {clearlyDefined}</h2>
            <h3>
              Becoming {clearlyDefined} means identifying the information others need, but in your terms. The{' '}
              {clearlyDefined} community meets you where you are to enable automated discovery of your essential data.
              In many cases it's as easy as adding a few properties to a package manifest or dropping a simple file in
              your code repo.{' '}
              <a href="https://docs.clearlydefined.io/adopting" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
          <Col md={logoColWidth} className="valign-child">
            {this.renderNeighborhood(adopt)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={textColWidth}>
            <h2 style={primaryColor}>Use definitions</h2>
            <h3>
              {clearlyDefined} harvests and curates key data about projects from around the world and makes it available
              through a simple REST API and web user experience. Use the data when picking components. Use it to enable
              more collaboration with other project. Use the data to simplify your compliance efforts.{' '}
              <a href="https://docs.clearlydefined.io/using-data" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
          <Col md={logoColWidth} className="valign-child">
            {this.renderNeighborhood(use)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={textColWidth}>
            <h2 style={primaryColor}>Contribute or curate data</h2>
            <h3>
              {clearlyDefined} is a community approach to a community challenge. If you've ever had to figure out where
              source is, or what license is being used, you can contribute to {clearlyDefined}. Add new data, curate
              data provided by others. It's an open source community like any other.{' '}
              <a href="https://docs.clearlydefined.io/contributing-data" target="_blank" rel="noopener noreferrer">
                Learn more...
              </a>
            </h3>
          </Col>
          <Col md={logoColWidth} className="valign-child">
            {this.renderNeighborhood(contribute)}
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageLanding)
