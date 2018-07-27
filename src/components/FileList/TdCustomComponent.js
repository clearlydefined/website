// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'

/**
 * Custom Table Data Component used for render inside TreeTable structure
 *
 */
export default class TdCustomComponent extends Component {
  render() {
    const { ri, style, defaultProps, ...rest } = this.props

    const customStyle = !style.width
      ? {
          padding: '0px'
        }
      : {
          paddingTop: '7px',
          paddingBottom: '7px',
          paddingLeft: style.paddingLeft
        }

    return <defaultProps.TdComponent {...rest} style={{ ...style, textAlign: 'left', border: '0px', ...customStyle }} />
  }
}
