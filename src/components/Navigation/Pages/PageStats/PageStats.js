// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Jumbotron } from 'react-bootstrap'
import TypeCard from './TypeCard'
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
    const totalComponents = await getStats('totalcount')
    this.setState({ totalComponents: totalComponents.value })
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
          </Jumbotron>
        </Row>
        <Row>
          <div className="card-container">
            <TypeCard type="npm" image={npm} />
            <TypeCard type="maven" image={maven} />
            <TypeCard type="nuget" image={nuget} />
            <TypeCard type="git" image={git} />
            <TypeCard type="pod" image={pod} />
            <TypeCard type="crate" image={crate} />
            <TypeCard type="gem" image={gem} />
            <TypeCard type="pypi" image={pypi} />
          </div>
        </Row>
      </Grid>
    )
  }
}
