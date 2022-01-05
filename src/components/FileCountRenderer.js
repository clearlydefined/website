// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Contribution from '../utils/contribution'

class FileCountRenderer extends Component {
  static propTypes = {
    definition: PropTypes.object.isRequired
  }

  render() {
    const { licensed } = this.props.definition
    const totalFiles = get(licensed, 'files') || 0
    const discovered = totalFiles - (get(licensed, 'discovered.unknown') || 0)
    const attributed = totalFiles - (get(licensed, 'attribution.unknown') || 0)
    const discoveredPercent = totalFiles ? Contribution.getPercentage(discovered, totalFiles) : '-'
    const attributedPercent = totalFiles ? Contribution.getPercentage(attributed, totalFiles) : '-'

    return (
      // prettier-ignore
      this.props.detailView ?
        <div className="list-singleLine flex-column">
          <p className="w-100 m-0">
            Total:&nbsp;<b>{totalFiles}</b>
          </p>
          <p className="w-100 m-0">
            Licensed:&nbsp;<b>{discovered < 0 ? '-' : `${discovered} (${discoveredPercent}%)`}</b>
          </p>
          <p className="w-100 m-0">
            Attributed:&nbsp;<b>{attributed < 0 ? '-' : `${attributed} (${attributedPercent}%)`}</b>
          </p>
        </div>
        :
        <span className="list-singleLine">
          <span>Total: <b>{totalFiles}</b></span>
          <span>Licensed: <b>{discovered < 0 ? '-' : `${discovered} (${discoveredPercent}%)`}</b></span>
          <span>Attributed: <b>{attributed < 0 ? '-' : `${attributed} (${attributedPercent}%)`}</b></span>
        </span>

    )
  }
}

export default FileCountRenderer
