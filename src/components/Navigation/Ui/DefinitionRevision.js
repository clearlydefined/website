// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

class DefinitionRevision extends Component {
  static propTypes = {
    definition: PropTypes.object
  }

  render() {
    const { definition } = this.props

    return get(definition, 'described.urls.version') ? (
      <span>
        &nbsp;&nbsp;&nbsp;
        <a href={get(definition, 'described.urls.version')} target="_blank" rel="noopener noreferrer">
          {definition.coordinates.revision.slice(0, 10)}
        </a>
      </span>
    ) : (
      <span>
        &nbsp;&nbsp;&nbsp;
        {definition.coordinates.revision.slice(0, 10)}
      </span>
    )
  }
}

export default DefinitionRevision
