// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Tooltip from 'antd/lib/tooltip'
import EntitySpec from '../../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'

class DefinitionTitle extends Component {
  static propTypes = {
    definition: PropTypes.object,
    showNamespace: PropTypes.bool
  }

  static defaultProps = {
    showNamespace: true
  }

  renderDefinitionTitle = () => {
    const { definition, showNamespace } = this.props
    return (
      <>
        {showNamespace && definition.coordinates.namespace ? definition.coordinates.namespace + '/' : ''}
        {definition.coordinates.name}
      </>
    )
  }

  render() {
    const { definition, component } = this.props
    const currentComponent = EntitySpec.fromObject(component)
    return get(definition, 'described.urls.registry') ? (
      <Tooltip title={this.renderDefinitionTitle()}>
        <a
          href={`${window.location.origin}${ROUTE_DEFINITIONS}/${currentComponent.toPath()}`}
          // href={get(definition, 'described.urls.registry')}
          // target="_blank"
          rel="noopener noreferrer"
          data-test-id="component-name"
        >
          {this.renderDefinitionTitle()}
        </a>
      </Tooltip>
    ) : (
      <Tooltip title={this.renderDefinitionTitle()}>
        <span data-test-id="component-name">{this.renderDefinitionTitle()}</span>
      </Tooltip>
    )
  }
}

export default DefinitionTitle
