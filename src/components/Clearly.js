// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const primaryColor = { color: '#0064b5' }
export const secondaryColor = { color: '#60b360' }
export const licensedColor = { color: '#38a038' }
export const describedColor = { color: '#00b294' }
export const secureColor = { color: '#409ae1' }
export const definedColor = primaryColor

export default class Clearly extends Component {
  static propTypes = {
    word: PropTypes.string,
    style: PropTypes.object
  }

  render() {
    return (
      <span style={this.props.style}>
        Clearly
        <span className="semi-bold">{this.props.children}</span>
      </span>
    )
  }
}
