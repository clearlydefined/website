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

class Charter extends Component {
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

  menuList = ['Scope', 'Processes', 'Roles', 'Voting', 'Recognition and promotion']

  render() {
    return (
      <div className="charter-container">
        <div className="charter-header">
          <div className="container">
            <div className="header-block">
              <img src={UseData} alt="335group" />
              <div className="sub-heading">Charter</div>
              <div className="title">Help FOSS projects be more successful through clearly defined project data.</div>
            </div>
          </div>
        </div>
        <div className="charter-main">
          <Grid>
            <Row className="charter-wrapper">
              <Col md={3} className="charter-side-content">
                {/* <div className="menu-title">Use the Data</div> */}
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
                    <Collapse.Panel className="menu-mobile-title" header="Menu" key="1">
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
              <Col md={9} className="charter-main-content">
                <div className="menu-title mb-4">Scope</div>
                <div className="menu-discription mb-5">
                  ClearlyDefined will pursue any data that makes FOSS projects easier to consume and thus more
                  successful. Initially this work will focus on licensing data that form the core of understanding and
                  meeting the legal obligations related to using FOSS. This includes:
                </div>
                <ul className="menu-list-items mb-5">
                  <li>License (declared and observed)</li>
                  <li>Copyright holders</li>
                  <li>Source location (including revision/commit)</li>
                </ul>
                <div className="menu-small-title mb-4">Why?</div>
                <div className="menu-discription mb-4">
                  The FOSS licensing and security information landscape is vast and varied. Projects without clear
                  metadata are harder to adopt and so get fewer contributions and lower engagement – they enjoy less
                  success. On the consumer side, enormous effort is required to discover, comply with licensing
                  obligations, and track security issues. Even simple things like the location of the source for a
                  component can be painful to find.
                </div>
                <div className="menu-small-title mb-4">What?</div>
                <div className="menu-discription mb-4">
                  Crowdsourcing the curation of licensing, security, accessibility data for FOSS projects. First clear
                  licensing data. Later, clear security, accessibility data.
                </div>
                <div className="menu-small-title mb-4">How?</div>
                <div className="menu-discription mb-4">
                  Harvesting data embedded in projects, curating the data in an open and collaborative process,
                  contributing clearly defined project data back to the FOSS projects, and making the data freely and
                  easily accessible. A virtuous cycle.
                </div>

                <div className="menu-small-title mb-4">Future efforts will focus on further topics such as:</div>
                <ul className="menu-list-items mb-5">
                  <li>Security – facilitating the reporting and tracking of vulnerabilities in projects</li>
                  <li>
                    Accessibility – Characteristics and analysis of a project’s support of accessibility related
                    technology and concerns
                  </li>
                  <li>Project data – Governance model, principals, issue tracking, discussion forums, …</li>
                </ul>
                <div className="menu-discription mb-4">
                  The ordering of this work and effort applied will depend entirely on the community and their
                  interests.
                </div>
                <div className="section-divider"></div>
              </Col>
            </Row>
          </Grid>
          <Grid>
            <Row className="charter-wrapper">
              <Col md={3} className="charter-side-content">
                {/* <div className="menu-title">Use the Data</div> */}
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
                    <Collapse.Panel className="menu-mobile-title" header="Menu" key="1">
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
              <Col md={9} className="charter-main-content">
                <div className="highlight-text">ClearlyDefined, governed.</div>
                <div className="menu-title mb-4">Processes</div>
                <div className="menu-discription mb-5">
                  The continuing goal of ClearlyDefined is to help originating projects craft and maintain clarity
                  around their in-scope data as a native part of their operation. Where that is not possible, the
                  project will maintain the relevant data. This is viewed as a fork of the upstream project and, like
                  code forks, should be minimized. Either way, the project serves as a one-stop-shop for the in-scope
                  data making life easy for consumers.
                </div>
                <div className="menu-discription mb-5">
                  The project undertakes four main operations in support of the stated goals and scope. Those processes
                  are listed here in rough execution order:
                </div>
                <div className="menu-small-title mb-4">Harvest</div>
                <div className="menu-discription mb-4">
                  Harvesting is the act getting data from upstream projects. This may be as simple as reading prescribed
                  data from canonical locations to full-on analysis of the source code using a variety of open tools.
                  The discovered data is stored in its entirety in its native form in ClearlyDefined infrastructure and
                  made available to the community on demand. The harvesting tools themselves are always fully open and
                  accessible to the community for vetting and inspection. The project is open to including new tools
                  subject to a vote, as described below.
                </div>
                <div className="menu-discription mb-4">
                  Harvesting may be run by the ClearlyDefined project itself or by designated parties, typically
                  curators. In all cases, only output from agreed to tools and configurations will be admitted to the
                  system. Harvesting operators are free to focus on a given domain of projects that best suit their
                  expertise and interests.
                </div>
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
export default connect(mapStateToProps)(Charter)
