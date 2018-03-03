// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const blue = '#0064b5'
export const green = '#60b360'

export default class Clearly extends Component {
  static propTypes = {
    word: PropTypes.string,
    color: PropTypes.string
  }

  render() {
    return <span style={{color: this.props.color}}>Clearly<span className='semi-bold'>{this.props.children}</span></span>
  }
}