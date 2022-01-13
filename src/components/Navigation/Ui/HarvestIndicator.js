// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { Tooltip } from 'antd'

class HarvestIndicator extends Component {
  getTools = tools => {
    return !tools ? 0 : tools.length > 2 ? 2 : tools.length
  }

  getColor = tools => {
    const colors = ['#cb2431', '#d6af22', '#2cbe4e']
    return colors[this.getTools(tools)]
  }
  getHarvestStatus = tools => {
    const status = ['Not Harvested', 'Partially Harvested', 'Harvested']
    return status[this.getTools(tools)]
  }
  getTooltip = tools => {
    const tooltip = ['Not Harvested', 'Partially Harvested', 'Harvested']
    return tooltip[this.getTools(tools)]
  }
  render() {
    const { tools } = this.props
    return (
      <Tooltip title={this.getTooltip(tools)}>
        {/* <Tag className="cd-badge" color={this.getColor(tools)}>
          {this.getHarvestStatus(tools)}
        </Tag> */}
        <div className="clearly-badge">
          {this.getHarvestStatus(tools)}
        </div>
      </Tooltip>
    )
  }
}

export default HarvestIndicator
