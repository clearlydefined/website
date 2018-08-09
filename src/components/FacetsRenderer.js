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
    console.log(item)
    return <div className={item.original.areFacetsDifferent}>{item.value}</div>
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
