// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Specific renderer for Facets
 *
 */
class FacetsRenderer extends Component {
  render() {
    const { item } = this.props
    return <div>{item.value || 'core'}</div>
  }
}

FacetsRenderer.propTypes = {
  /**
   * item to show
   */
  item: PropTypes.shape({
    value: PropTypes.array
  }).isRequired
}

export default FacetsRenderer
