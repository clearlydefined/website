// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PivotValueCustomComponent from './PivotValueCustomComponent'

/**
 * Custom Pivot Component used for render inside TreeTable structure
 *
 */
export default class PivotCustomComponent extends Component {
  render() {
    const { defaultProps, ...cellInfo } = this.props

    return (
      <div>
        <defaultProps.ExpanderComponent {...cellInfo} />
        <PivotValueCustomComponent {...cellInfo} />
      </div>
    )
  }
}
