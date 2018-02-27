// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class Clearly extends Component {
  static propTypes = {
    word: PropTypes.string
  }

  render() {
    return <span>Clearly<span className='semi-bold'>{this.props.children}</span></span>
  }
}