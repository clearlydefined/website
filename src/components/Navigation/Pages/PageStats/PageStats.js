// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Jumbotron, Tabs, Tab } from 'react-bootstrap'
import { getStatAction } from '../../../../actions/statsActions'
import get from 'lodash/get'
import TypeCard from './TypeCard'
import LicenseBreakdown from './LicenseBreakdown'
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

  render() {
    const { stats } = this.props
    return (
      <Grid className="main-container">
        <Row>
          <Jumbotron className="text-center" style={{ backgroundColor: '#ecf0f1' }}>
            <h2>
              <CountUp end={get(stats, 'entries.total.value.totalCount') || 0} separator="," />
            </h2>
            <p>Number of total definitions</p>
            <span>median licensed score: {get(stats, 'entries.total.value.licensedScoreMedian') || 0}</span>
            <span> | </span>
            <span>median described score: {get(stats, 'entries.total.value.describedScoreMedian') || 0}</span>
          </Jumbotron>
        </Row>
        <Row>
          <div className="card-container">
            {Object.keys(types).map(type => (
              <TypeCard type={type} image={types[type]} stats={get(stats, `entries.${type}.value`)} key={type}/>
            ))}
          </div>
        </Row>
        <hr />
        <Row>
          <h2>Declared License Breakdown</h2>
          <Tabs id="packages">
            <Tab eventKey="overall" title="Overall">
              <LicenseBreakdown type="total" stats={get(stats, 'entries.total.value')} />
            </Tab>
            {Object.keys(types).map(type => (
              <Tab eventKey={type} title={type} key={type}>
                <LicenseBreakdown type="total" stats={get(stats, `entries.${type}.value`)} />
              </Tab>
            ))}
          </Tabs>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    stats: state.stat.bodies
  }
}

export default connect(mapStateToProps)(PageStats)
