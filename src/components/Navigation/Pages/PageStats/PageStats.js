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
import npm from '../../../../../src/images/n-large.png'
import maven from '../../../../../src/images/maven.png'
import nuget from '../../../../../src/images/nuget.svg'
import pod from '../../../../../src/images/pod.png'
import git from '../../../../../src/images/GitHub-Mark-120px-plus.png'
import crate from '../../../../../src/images/cargo.png'
import gem from '../../../../../src/images/gem.png'
import pypi from '../../../../../src/images/pypi.png'

const types = {
  npm: npm,
  gem: gem,
  pypi: pypi,
  maven: maven,
  nuget: nuget,
  git: git,
  crate: crate,
  pod: pod
}

class PageStats extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
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
              <TypeCard type={type} image={types[type]} stats={get(stats, `entries.${type}.value`)} />
            ))}
          </div>
        </Row>
        <hr />
        <Row>
          <h2>Declared License Breakdown</h2>
          <Tabs>
            <Tab eventKey="overall" title="Overall">
              <LicenseBreakdown type="total" stats={get(stats, 'entries.total.value')} />
            </Tab>
            {Object.keys(types).map(type => (
              <Tab eventKey={type} title={type}>
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
