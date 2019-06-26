// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Tooltip from 'antd/lib/tooltip'

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
    const { definition } = this.props
    return get(definition, 'described.urls.registry') ? (
      <span>
        <Tooltip title={this.renderDefinitionTitle()}>
          <a
            href={get(definition, 'described.urls.registry')}
            target="_blank"
            rel="noopener noreferrer"
            data-test-id="component-name"
          >
            {this.renderDefinitionTitle()}
          </a>
        </Tooltip>
      </span>
    ) : (
      <Tooltip title={this.renderDefinitionTitle()}>
        <span data-test-id="component-name">{this.renderDefinitionTitle()}</span>
      </Tooltip>
    )
  }
}

export default DefinitionTitle
