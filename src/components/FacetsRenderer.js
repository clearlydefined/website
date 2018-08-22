// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Specific renderer for Facets
 *
 */
class FacetsRenderer extends Component {
  static propTypes = {
    item: PropTypes.shape({
      value: PropTypes.array
    }).isRequired
  }

  render() {
    const { item } = this.props
    return (
      <div>
        {item.value.map((val, i) => (
          <span key={i} className={val.isDifferent ? 'facets--isEdited' : ''}>
            {val.value || 'core'}
          </span>
        ))}
      </div>
    )
  }
}

export default FacetsRenderer
