// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { UserCard } from 'react-ui-cards'

export default class TypeCard extends Component {
  static defaultProps = {
    stats: {
      totalCount: 0,
      describedScoreMedian: 0,
      licensedScoreMedian: 0
    }
  }

  render() {
    const { image, type, stats } = this.props
    return (
      <UserCard
        cardClass="float"
        header={image}
        name={type}
        positionName={`total count: ${stats.totalCount.toLocaleString()}`}
        stats={[
          {
            name: 'median licensed score',
            value: stats.licensedScoreMedian
          },
          {
            name: 'median described score',
            value: stats.describedScoreMedian
          }
        ]}
      />
    )
  }
}
