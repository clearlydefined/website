// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const primaryColor = { color: '#0064b5' };
export const secondaryColor = { color: '#60b360' };

export default class Clearly extends Component {
  static propTypes = {
    word: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    return (
      <span style={this.props.style}>
        Clearly<span className="semi-bold">{this.props.children}</span>
      </span>
    );
  }
}
