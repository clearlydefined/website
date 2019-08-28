// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Tooltip from 'antd/lib/tooltip'

class DefinitionRevision extends Component {
  static propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string
  }

  render() {
    const { definition, className } = this.props

    return get(definition, 'described.urls.version') ? (
      <span className={className}>
        <Tooltip title={definition.coordinates.revision}>
          <a href={get(definition, 'described.urls.version')} target="_blank" rel="noopener noreferrer">
            {definition.coordinates.revision}
          </a>
        </Tooltip>
      </span>
    ) : (
      <span className={className}>
        <Tooltip title={definition.coordinates.revision}>{definition.coordinates.revision}</Tooltip>
      </span>
    )
  }
}

export default DefinitionRevision
