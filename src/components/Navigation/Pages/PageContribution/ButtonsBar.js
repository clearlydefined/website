// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

export default class ButtonsBar extends Component {
  static propTypes = {
    toggleCollapseExpandAll: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="pull-right">
        <Button bsStyle="default" onClick={this.props.toggleCollapseExpandAll}>
          Toggle Collapse
        </Button>
      </div>
    )
  }
}
