// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Jumbotron, Tabs, Tab } from 'react-bootstrap'
import TypeCard from './TypeCard'
import LicenseBreakdown from './LicenseBreakdown'
import CountUp from 'react-countup'
import { getStats } from '../../../../api/clearlyDefined'
import npm from '../../../../../src/images/n-large.png'
import maven from '../../../../../src/images/maven.png'
import nuget from '../../../../../src/images/nuget.svg'
import pod from '../../../../../src/images/pod.png'
import git from '../../../../../src/images/GitHub-Mark-120px-plus.png'
import crate from '../../../../../src/images/cargo.png'
import gem from '../../../../../src/images/gem.png'
import pypi from '../../../../../src/images/pypi.png'

export default class PageStats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalComponents: 0
    }
  }

  async componentDidMount() {
    const stats = await getStats('total')
    this.setState({
      totalComponents: stats.value.totalCount,
      describedScoreMedian: stats.value.describedScoreMedian,
      licensedScoreMedian: stats.value.licensedScoreMedian
    })
  }

  render() {
    return (
      <Grid className="main-container">
        <Row>
          <Jumbotron className="text-center" style={{ backgroundColor: '#ecf0f1' }}>
            <h2>
              <CountUp end={this.state.totalComponents} separator="," />
            </h2>
            <p>Number of total definitions</p>
            <small>median licensed score: {this.state.licensedScoreMedian}</small>
            <small> | </small>
            <small>median described score: {this.state.describedScoreMedian}</small>
          </Jumbotron>
        </Row>
        <Row>
          <div className="card-container">
            <TypeCard type="npm" image={npm} />
            <TypeCard type="gem" image={gem} />
            <TypeCard type="pypi" image={pypi} />
            <TypeCard type="maven" image={maven} />
            <TypeCard type="nuget" image={nuget} />
            <TypeCard type="git" image={git} />
            <TypeCard type="pod" image={pod} />
            <TypeCard type="crate" image={crate} />
          </div>
        </Row>
        <hr />
        <Row>
          <h2>Declared License Breakdown</h2>
          <Tabs>
            <Tab eventKey="overall" title="Overall">
              <LicenseBreakdown type="total" />
            </Tab>
            <Tab eventKey="npm" title="NPM">
              <LicenseBreakdown type="npm" />
            </Tab>
            <Tab eventKey="gem" title="Gem">
              <LicenseBreakdown type="gem" />
            </Tab>
            <Tab eventKey="pypi" title="PyPi">
              <LicenseBreakdown type="pypi" />
            </Tab>
            <Tab eventKey="maven" title="Maven">
              <LicenseBreakdown type="maven" />
            </Tab>
            <Tab eventKey="nuget" title="NuGet">
              <LicenseBreakdown type="nuget" />
            </Tab>
            <Tab eventKey="git" title="Git">
              <LicenseBreakdown type="git" />
            </Tab>
            <Tab eventKey="pod" title="Pod">
              <LicenseBreakdown type="pod" />
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    )
  }
}
