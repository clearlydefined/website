// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { UserCard } from 'react-ui-cards'
import { getStats } from '../../../../api/clearlyDefined'

export default class TypeCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: 0,
      describedScoreMedian: 0,
      licensedScoreMedian: 0
    }
  }

  async componentDidMount() {
    const data = await getStats(this.props.type)
    if (!data.value) return
    this.setState({
      totalCount: data.value.totalCount,
      describedScoreMedian: data.value.describedScoreMedian,
      licensedScoreMedian: data.value.licensedScoreMedian
    })
  }

  render() {
    return (
      <UserCard
        cardClass="float"
        header={this.props.image}
        name={this.props.type}
        positionName={`total count: ${this.state.totalCount.toLocaleString()}`}
        stats={[
          {
            name: 'median licensed score',
            value: this.state.licensedScoreMedian
          },
          {
            name: 'median described score',
            value: this.state.describedScoreMedian
          }
        ]}
      />
    )
  }
}
