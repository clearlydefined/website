// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'

/**
 * Custom Table Head Component used for render inside TreeTable structure
 *
 */
export default class ThCustomComponent extends Component {
  render() {
    const { ri, style, defaultProps, ...rest } = this.props
    return (
      <defaultProps.ThComponent
        {...rest}
        style={{ ...style, textAlign: 'left', border: '0px', padding: '0px', paddingTop: '7px', paddingBottom: '7px' }}
      />
    )
  }
}
