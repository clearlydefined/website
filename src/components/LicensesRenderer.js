// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import PopoverRenderer from './PopoverRenderer'

/**
 * Specific renderer for Licenses data
 * It show a string of data, and if clicked opens a Popover containing a list of details
 *
 */
class LicensesRenderer extends Component {
  render() {
    const { item } = this.props

    return (
      <ButtonToolbar>
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="left"
          overlay={<PopoverRenderer title="Licenses" values={item.value} />}
        >
          <div>{item.value}</div>
        </OverlayTrigger>
      </ButtonToolbar>
    )
  }
}

LicensesRenderer.propTypes = {
  /**
   * item to show
   */
  item: PropTypes.shape({
    value: PropTypes.string
  }).isRequired
}

export default LicensesRenderer
