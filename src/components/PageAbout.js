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
              <p>
                </p>
              ClearlyDefined is on a mission to help FOSS projects thrive by being, well, clearly defined. Lack of clarity around licenses and security vulnerabilities reduces engagement -- that means fewer users, 
              fewer contributors and a smaller community.
              <p>
                </p>
             <p>
            This is a community-wide challenge that needs a community-wide approach. 
            <p>
            </p>

            <p>
            We are:
          <ul className="list-style-type:square">
            <li> Raising awareness about this challenge within FOSS project teams</li>
            <li> Automatically harvesting data from projects</li>
            <li> Making it easy to identify and contribute missing information</li>
            <li> Crowd-sourcing the curation of these contributions</li>
            <li>Feeding curated contributions back to the original projects</li>
            </ul>
          FOSS consumers often struggle to find basic things like the license for a component, the source location (e.g., Git commit) for 
          a version, and details to be included in attributions (e.g., copyright holders in a Notices file). 
          These ambiguities make projects hard to consume. Projects that are hard to consume get less engagement. Everyone loses.
         <p>
           </p>
          To date, most people are: ignoring the problem, vetting FOSS through repetitive, duplicative efforts, or employing external services to do this task. ClearlyDefined seeks to help projects be more clear from the beginning. 
          It provides a mechanism for harvesting available data using tools such as ScanCode and FOSSology, and facilitates crowd-sourcing the curation of that information when ambiguities or gaps arise. The ultimate goal of harvesting 
          and curation is to contribute any new-found clarity (e.g., new licenses found) to the upstream projects so they can include the updates in their next release -- thus becoming more clearly defined. Everyone wins.
          <p>
          </p>
          Right now the focus is on clarifying an individual project’s license, source code location, and copyright holders -- all the essentials for engaging with a project. Going forward, we see security, accessibility, and internationalization 
          being important parts of the ClearlyDefined ecosystem. 
          <p>
          </p>
          It’s still very early days and we don’t have all the answers. ClearlyDefined is still being defined. You can help. Come design the processes, make decisions, connect with projects, and build the community. 
          Find out more about <a href="https://github.com/clearlydefined/clearlydefined/wiki/Get-Involved">how to get involved</a>.
          <p>
            <p>
              </p>
          You can find us at <a href="clearlydefined.io">clearlydefined.io</a>, <a href="github.com/clearlydefined">github.com/clearlydefined</a>, and <a href="mailto:clearlydefined@googlegroups.com">clearlydefined@googlegroups.com</a>. 
         <p>
           </p>
          We'd love to hear how you want to get involved in ClearlyDefined!
        </p>
        </p>
        </p>
        </h4>
          </Col>
        </Row>
        <Row className="show-grid neighborhood-row">
          <Col md={1}>
          </Col>
          <Col md={10}>
            <h2>Partners</h2>
            <h3>
              <table>
                <tr>
                  <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/AWS_logo_RGB.png" width="200" height="120"></img></td>
                  <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/Eclipse_Logo2014_New(High_Res).jpg" width="200" height="47"></img></td>
                  <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/HERE.png" width="200" height="183"></img></td>
                </tr>
                <tr>
                     <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/ImgOne.jpg" width="200" height="116"></img></td>
                     <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/nexB.png" width="200" height="105"></img></td>
                     <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/osi_standard_logo.png" width="200" height="228"></img></td>
                </tr>
                <tr>
                   <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/qualcomm.jpg" width="200" height="110"></img></td>
                  <td><img src="https://raw.githubusercontent.com/clearlydefined/website/cd0875756b126c483ff970f3d0c09199bb354443/src/images/partner-logos/software-heritage-logo-title.1024px.png" width="200" height="44"></img></td>
                </tr>
                </table>
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
