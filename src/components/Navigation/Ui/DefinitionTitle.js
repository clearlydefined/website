// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

class DefinitionTitle extends Component {
  static propTypes = {
    definition: PropTypes.object,
    showNamespace: PropTypes.bool
  }

  static defaultProps = {
    showNamespace: true
  }

  render() {
    const { definition, showNamespace } = this.props
    return get(definition, 'described.urls.registry') ? (
      <span>
        <a
          href={get(definition, 'described.urls.registry')}
          target="_blank"
          rel="noopener noreferrer"
          data-test-id="component-name"
        >
          {showNamespace && definition.coordinates.namespace ? definition.coordinates.namespace + '/' : ''}
          {definition.coordinates.name}
        </a>
      </span>
    ) : (
      <span data-test-id="component-name">{definition.coordinates.name}</span>
    )
  }
}

export default DefinitionTitle
