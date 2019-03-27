// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tag from 'antd/lib/tag'

/**
 * Specific renderer for Facets
 *
 */
class FacetsRenderer extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired
  }

  render() {
    const { values } = this.props
    return (
      <div>
        {values.length > 0 ? (
          values.map((val, i) => (
            <Tag key={i} className={val.isDifferent ? 'facets--isEdited' : ''}>
              {val.value}
            </Tag>
          ))
        ) : (
          <Tag>core</Tag>
        )}
      </div>
    )
  }
}

export default FacetsRenderer
