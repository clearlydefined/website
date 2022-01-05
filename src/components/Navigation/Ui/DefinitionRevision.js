// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Tooltip from 'antd/lib/tooltip'
import EntitySpec from '../../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'

class DefinitionRevision extends Component {
  static propTypes = {
    definition: PropTypes.object,
    className: PropTypes.string
  }

  render() {
    const { definition, className, component } = this.props
    const currentComponent = EntitySpec.fromObject(component)
    return get(definition, 'described.urls.version') ? (
      <span className={className}>
        <Tooltip title={definition.coordinates.revision}>
          <a
            href={`${window.location.origin}${ROUTE_DEFINITIONS}/${currentComponent.toPath()}`}
            rel="noopener noreferrer"
          >
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
