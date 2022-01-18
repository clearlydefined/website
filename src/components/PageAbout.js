// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'
import { ROUTE_ABOUT } from '../utils/routingConstants'

import aboutSection from '../images/about-section.svg'
import centralized from '../images/Centralized.png'
import openSource from '../images/open-source.png'
import curated from '../images/curated.png'
import community from '../images/community.png'
import UseData from '../images/UseData.png'
import CurateData from '../images/CurateData.png'
import ContributeData from '../images/ContributeData.png'
import ContributeCode from '../images/ContributeCode.png'
import AddHarvest from '../images/AddHarvest.png'
import AdoptPractices from '../images/AdoptPractices.png'

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

  render() {
    return (
      <>
        <div className="about-container">

          <div className="about-hero">
            <div className="container">
              <div className="about-hero__content">
                <h1 className="mkt-h1 about-title">Bringing clarity to Open Source Software licenses.</h1>
                <p className="about-description">
                  Welcome to your centralized and curated data store for Open Source Software licenses.
                </p>
                <a className="btn-mkt" href="/get-involved">Get Involved</a>
              </div>
            </div>
          </div>

          <img className="about-hero__shapes" src={aboutSection} alt="logo" width="100%" />

          <div className="about-content-section">
            <div className="container">
              <div className="about-content-title mkt-h2">
                Helping FOSS projects be more successful through clearly defined project data.{' '}
              </div>
              <div className="about-content-section-body">
                <div className="content-block">
                  <img src={centralized} alt="logo" className="about-content-logo" />
                  <div className="content-block-description">
                    <h3 className="mkt-h3">Centralized</h3>
                    <p>
                      ClearlyDefined is you central hub for all things Open Source Software licenses. It’s here you’ll
                      find, or contribute, to critical license data.
                    </p>
                  </div>
                </div>
                <div className="content-block">
                  <img src={openSource} alt="logo" className="about-content-logo" />
                  <div className="content-block-description">
                    <h3 className="mkt-h3">Curated</h3>
                    <p>
                      License data is curated by our dedicated team of contributors, and people like you. Our goal is to
                      ensure completeness and accuracy of data.
                    </p>
                  </div>
                </div>
                <div className="content-block">
                  <img src={curated} alt="logo" className="about-content-logo" />
                  <div className="content-block-description">
                    <h3 className="mkt-h3">Open Source</h3>
                    <p>
                      The more, the merrier. We all benefit from the open source nature of ClearlyDefined, where
                      together, we can all make a meaningful contribution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="community-container">
          <div className="container">
            <div className="community-content">
              <div>
                <div className="mkt-h4 pb-4">Goals</div>
                <div className="mkt-h2">This is a community-wide challenge that needs a community-wide approach.</div>
                <a className="learn-more" href="/stats">Learn more</a>
              </div>
              <div className="left-top"></div>
              <div className="right-top"></div>
              <div className="right-bottom"></div>
            </div>
            <div className="community-image">
              <img src={community} alt="People gathered around a computer" />
              <div className="left-top"></div>
              <div className="left-bottom">
                <div className="left-bottom-top"></div>
                <div className="left-bottom-bottom">
                  <div className="left-bottom-bottom-left"></div>
                  <div className="left-bottom-bottom-right"></div>
                </div>
              </div>
            </div>
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
      </>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageAbout)
