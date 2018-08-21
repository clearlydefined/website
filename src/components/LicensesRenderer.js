// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, ButtonToolbar } from 'react-bootstrap'
import PopoverRenderer from './PopoverRenderer'
import InlineEditor from './InlineEditor'

/**
 * Specific renderer for Licenses data
 * It show a string of data, and if clicked opens a Popover containing a list of details
 *
 */
class LicensesRenderer extends Component {
  render() {
    const { value, isDifferent, onSave } = this.props

    return (
      <InlineEditor
        extraClass={isDifferent ? 'license--isEdited' : ''}
        readOnly={false}
        type={'license'}
        initialValue={value}
        value={value}
        onChange={value => onSave(value)}
        validator={true}
        placeholder={'SPDX License'}
      />
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
