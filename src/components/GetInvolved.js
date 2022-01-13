// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'
import { ROUTE_ABOUT } from '../utils/routingConstants'
import { Collapse } from 'antd'
import UseData from '../images/UseData.png'
import CurateData from '../images/CurateData.png'
import ContributeData from '../images/ContributeData.png'
import ContributeCode from '../images/ContributeCode.png'
import AddHarvest from '../images/AddHarvest.png'
import AdoptPractices from '../images/AdoptPractices.png'

class GetInvolved extends Component {
  constructor(props) {
    super(props)
    this.state = { activeTab: 0 }
  }
  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_ABOUT }))
  }

  communityItems = [
    {
      img: UseData,
      name: 'Use the Data',
      text: 'The simplest thing you can do to get involved is to use the data.',
      linkText: 'Learn more'
    },
    {
      img: CurateData,
      name: 'Curate Data',
      text: 'Vet, discuss and merge contributions to the project.',
      linkText: 'Learn more'
    },
    {
      img: ContributeData,
      name: 'Contribute Data',
      text: 'Enhacing the data is something that anyone can do.',
      linkText: 'Learn more'
    },
    {
      img: ContributeCode,
      name: 'Contribute Code',
      text: 'It’s about the data but there is a non-trivial service that drives it.',
      linkText: 'Learn more'
    },
    {
      img: AddHarvest,
      name: 'Add a Harvest',
      text: 'Add to our growing types of packages.',
      linkText: 'Learn more'
    },
    {
      img: AdoptPractices,
      name: 'Adopt Practices',
      text: 'Help ensure that the information for components is correct.',
      linkText: 'Learn more'
    }
  ]

  menuList = ['Coordinates', 'Data API', 'Website', 'Curation']

  render() {
    return (
      <div className="get-involved-container">
        <div className="get-involved-header">
          <div className="container">
            <div className="header-block">
              <img src={UseData} alt="335group" />
              <div className="sub-heading">Get Involved</div>
              <div className="title">Using the ClearlyDefined data</div>
              <div className="description">
                All of the ClearlyDefined data is available for everyone to see and use. You can browse and inspect in a
                convenient web ui or hook up a client to the REST API and integrate it into your systems.
              </div>
            </div>
          </div>
        </div>
        <div className="get-involved-main">
          <Grid>
            <Row className="get-involved-wrapper">
              <Col md={3} className="get-involved-side-content">
                <div className="menu-title">Use the Data</div>
                <div className="menu-list menu-list-desktop">
                  {this.menuList.map((item, index) => {
                    return (
                      <div
                        className={`lisitng ${this.state.activeTab === index ? 'active' : ''}`}
                        onClick={() => this.setState({ activeTab: index })}
                      >
                        <div className="icon">
                          <span className="top-center"></span>
                          <span className="center-right"></span>
                          <span className="bottom-center"></span>
                        </div>
                        <span>{item}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="menu-list menu-list-mobile">
                  <Collapse defaultActiveKey={['1']} ghost className="menu-collapse">
                    <Collapse.Panel className="menu-mobile-title" header="Use the Data" key="1">
                      {this.menuList.map((item, index) => {
                        return (
                          <div
                            className={`lisitng ${this.state.activeTab === index ? 'active' : ''}`}
                            onClick={() => this.setState({ activeTab: index })}
                          >
                            <div className="icon">
                              <span className="top-center"></span>
                              <span className="center-right"></span>
                              <span className="bottom-center"></span>
                            </div>
                            <span>{item}</span>
                          </div>
                        )
                      })}
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Col>
              <Col md={9} className="get-involved-main-content">
                <div className="menu-title mb-4">ClearlyDefined Coordinates</div>
                <div className="menu-discription mb-5">
                  In order to use ClearlyDefined’s data (whether through the REST API or the Web UI), it’s critical to
                  understand how to find a component in the data. ClearlyDefined uses a system of coordinates to
                  navigate to data about particular components.
                </div>
                <div className="menu-small-title mb-4">Why?</div>
                <div className="menu-discription mb-4">
                  Typical coordinates that you will encounter are a five part path-like structure as follows:
                </div>
                <div className="menu-code mb-4">npm/npmjs/@fluentui/react-text/9.0.0-alpha.13</div>
                <div className="menu-discription mb-4">Or, more generally:</div>
                <div className="menu-code mb-4">type/provider/namespace/name/revision</div>
                <div className="menu-discription mb-5">Whare the segments have following values:</div>
                <ul className="menu-list-items mb-5">
                  <li>
                    type – the type of the component you are looking for. For example, npm, git, nuget, maven, … This
                    talks about the shape of the component.
                  </li>
                  <li>
                    provider – where the component can be found. Examples include npmjs, mavencentral, github, nuget.
                  </li>
                  <li>
                    namespace – many component systems have namespaces. GitHub orgs, NPM namespace, Maven group id, …
                    This segment must be supplied. If your component does not have a namespace, use ‘-‘ (ASCII hyphen).
                  </li>
                  <li>
                    name – the name of the component you want. Given the namespace segment mentioned above, this is just
                    the simple name.
                  </li>
                  <li>
                    revision – components typically have some differentiator like a version or commit id. Use that here.
                    If this segment is omitted, the latest revision is used (if that makes sense for the provider).
                  </li>
                </ul>
              </Col>
            </Row>
          </Grid>
        </div>
        <div className="community-item-container">
          <div className="title">6 ways to get involved</div>
          <Grid>
            <Row className="community-items">
              {this.communityItems.map((item, index) => {
                return (
                  <Col md={2} key={index} className="community-item">
                    <img src={item.img} alt="335group" />
                    <h3 className="community-item-name">{item.name}</h3>
                    <p className="community-item-discription">{item.text}</p>
                    <a href="#" className="community-item-link">
                      {item.linkText}
                    </a>
                  </Col>
                )
              })}
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(GetInvolved)
