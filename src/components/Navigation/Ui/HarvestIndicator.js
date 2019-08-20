// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { Tag, Tooltip } from 'antd'

class HarvestIndicator extends Component {
  getColor = tools => {
    const colors = ['#cb2431', '#d6af22', '#2cbe4e']
    return colors[tools.length > 2 ? 2 : tools.length]
  }
  getHarvestStatus = tools => {
    const status = ['Not Harvested', 'Partially Harvested', 'Harvested']
    return status[tools.length > 2 ? 2 : tools.length]
  }
  getTooltip = tools => {
    const tooltip = ['Not Harvested', 'Partially Harvested', 'Harvested']
    return tooltip[tools.length > 2 ? 2 : tools.length]
  }
  render() {
    const { tools } = this.props
    return (
      <Tooltip title={this.getTooltip(tools)}>
        <Tag className="cd-badge" color={this.getColor(tools)}>
          {this.getHarvestStatus(tools)}
        </Tag>
      </Tooltip>
    )
  }
}

export default HarvestIndicator
