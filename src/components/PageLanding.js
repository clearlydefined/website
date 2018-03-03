// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { ROUTE_ROOT } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import logo from '../images/logo-text-stacked.svg'
import { Clearly } from './'
import { primaryColor, secureColor, licensedColor, describedColor } from './Clearly'

import described from '../images/described-logo.svg'
import secure from '../images/secure-logo.svg'
import licensed from '../images/licensed-logo.svg'
const use = 'sign-out'
const contribute = 'sign-in'
const adopt = 'toggle-on'

const clearlyDefined = <Clearly>Defined</Clearly>

class PageLanding extends Component {

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ROOT }))
  }

  renderNeighborhood(name) {
    return (
      <div className="neighborhood-icon">
        <FontAwesome name={name} />
      </div>
    )
  }

  renderLogo(logo) {
    return (
      <div className="neighborhood-logo-container">
        <img className="neighborhood-logo" src={logo} alt='logo' />
      </div>
    )
  }

  render() {
    return (
      <Grid className="main-container">
        <img src={logo} alt='logo' className="landing-large-logo"/>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderLogo(described)}
          </Col>
          <Col md={8}>
            <h2><Clearly style={describedColor}>Described</Clearly></h2>
            <h3>
              Knowing simple things like the source location for a component version enables contribution of docs, bug 
              fixes, or new features. It also inspires confidence by enabling IP and security code scans, and source code 
              archiving and disclosure. Round that out with project and issue tracking site info, and you have a sound 
              basis for engagement. <a href=''>Learn more...</a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderLogo(licensed)}
          </Col>
          <Col md={8}>
            <h2><Clearly style={licensedColor}>Licensed</Clearly></h2>
            <h3>
              Defining and knowing the license for a component is essential to a successful partnership. Communities choose
              a license with terms they like. {clearlyDefined} helps clarify that choice and enables consumers to
              do follow the terms by identifying key data such as license set, attribution parties, and code location. <a href=''>Learn more...</a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={4} className="valign-child">
            {this.renderLogo(secure)}
          </Col>
          <Col md={8}>
            <h2><Clearly style={secureColor}>Secure</Clearly></h2>
            <h3>
              Teams working hard to create quality, secure components need a simple way of recording security issues they find 
              and fix. Bug report and pull requests are great. CVEs and global notifications are even better. It can still 
              be hard to relate that data to the components you use. {clearlyDefined} gives communities a security forum that  
              builds confidence and makes for even more collaboration. <a href=''>Learn more...</a>
            </h3>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={8}>
            <h2 style={primaryColor}>Get {clearlyDefined}</h2>
            <h3>
              Becoming {clearlyDefined} means identifying the information needed, in your terms. The {clearlyDefined} community 
              meets you where you are to enable automated discovery of your essential data. In many cases it's as easy as 
              adding a few properties to a package manifest or dropping a simple file in your code repo. <a href=''>Learn more...</a>
            </h3>
          </Col>
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(adopt)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={8}>
            <h2 style={primaryColor}>Use definitions</h2>
            <h3>
              {clearlyDefined} harvests and curates key data about projects from around the world and makes it available 
              through a simple REST API and web user experience. Use the data when picking components. Use it to enable more
              collaboration with other project. Use the data to simplify your compliance efforts. <a href=''>Learn more...</a>
            </h3>
          </Col>
          <Col md={4} className="valign-child">
            {this.renderNeighborhood(use)}
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={8}>
            <h2 style={primaryColor}>Contribute or curate data</h2>
            <h3>
              {clearlyDefined} is a community approach to a community challenge. If you've ever had to figure out where 
              source is, or what license is being used, you can contribute to {clearlyDefined}. Add new data, curate data
              provided by others. It's an open source community like any other. <a href=''>Learn more...</a>
            </h3>
          </Col>
          <Col md={4} className="valign-child">
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
