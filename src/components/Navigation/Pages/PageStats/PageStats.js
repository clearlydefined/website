// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Jumbotron, Col } from 'react-bootstrap'
import { getStatAction } from '../../../../actions/statsActions'
import get from 'lodash/get'
import TypeCard from './TypeCard'
import CountUp from 'react-countup'
import npm from '../../../../images/n-large.png'
import maven from '../../../../images/maven.png'
import nuget from '../../../../images/nuget.png'
import pod from '../../../../images/pod.png'
import git from '../../../../images/Git-Logo-2Color.png'
import crate from '../../../../images/cargo.png'
import composer from '../../../../images/packagist.png'
import gem from '../../../../images/gem.png'
import pypi from '../../../../images/pypi.png'
import debian from '../../../../images/debian.png'
import { uiNavigation } from '../../../../actions/ui'
import { ROUTE_STATS } from '../../../../utils/routingConstants'
import UseData from '../../../../images/UseData.png'
import CurateData from '../../../../images/CurateData.png'
import ContributeData from '../../../../images/ContributeData.png'
import ContributeCode from '../../../../images/ContributeCode.png'
import AddHarvest from '../../../../images/AddHarvest.png'
import AdoptPractices from '../../../../images/AdoptPractices.png'

const types = {
  npm: npm,
  gem: gem,
  pypi: pypi,
  maven: maven,
  nuget: nuget,
  git: git,
  crate: crate,
  deb: debian,
  debsrc: debian,
  composer: composer,
  pod: pod
}

class PageStats extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_STATS }))
    await Promise.all([
      this.props.dispatch(getStatAction('total')),
      ...Object.keys(types).map(type => this.props.dispatch(getStatAction(type)))
    ])
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
    const { stats } = this.props
    return (
      <div className="stats-container">
        <Grid>
          <Row>
            <Jumbotron className="text-center stats-header">
              <div className="header-left-icon">
                <div className="top-left"></div>
                <div className="center-right"></div>
                <div className="bottom-left"></div>
              </div>
              <div className="header-content">
                <h2>
                  <CountUp end={get(stats, 'entries.total.value.totalCount') || 0} separator="," />
                </h2>
                <p>Number of total definitions</p>
                {/* <span>median licensed score: {get(stats, 'entries.total.value.licensedScoreMedian') || 0}</span>
                <span> | </span>
                <span>median described score: {get(stats, 'entries.total.value.describedScoreMedian') || 0}</span> */}
              </div>
              <div className="header-right-icon">
                <div className="top-right"></div>
                <div className="center-left"></div>
                <div className="bottom-right"></div>
              </div>
            </Jumbotron>
            <div className="header-subcontent">
              <div className="text-center">
                <div className="value">{get(stats, 'entries.total.value.licensedScoreMedian') || 0}</div>
                <div className="label">Median licensed score</div>
              </div>
              <div className="text-center">
                <div className="value">{get(stats, 'entries.total.value.describedScoreMedian') || 0}</div>
                <div className="label">Median described score</div>
              </div>
            </div>
          </Row>
          <Row className="m-auto">
            {Object.keys(types).map(type => (
              <div className="card-list-contianer">
                <div className="image">
                  <img src={types[type]} alt={type} width="100%" height="100%" />
                </div>
                <div className="list-content">
                  <div className="title">{type}</div>
                  <div className="details">
                    <div className="total">
                      <p>{get(stats, `entries.${type}.value`)?.totalCount?.toLocaleString() || ''}</p>
                      <p>Total</p>
                    </div>
                    <div className="licensed">
                      <p>{get(stats, `entries.${type}.value`)?.licensedScoreMedian || ''}</p>
                      <p>Licensed</p>
                    </div>
                    <div className="described">
                      <p>{get(stats, `entries.${type}.value`)?.describedScoreMedian || ''}</p>
                      <p>Described</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Row>
          <Row>
            <div className="card-container">
              {Object.keys(types).map(type => (
                <TypeCard type={type} image={types[type]} stats={get(stats, `entries.${type}.value`)} key={type} />
              ))}
            </div>
          </Row>
        </Grid>
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

function mapStateToProps(state) {
  return {
    stats: state.stat.bodies
  }
}

export default connect(mapStateToProps)(PageStats)
