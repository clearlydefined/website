// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typeahead } from 'react-bootstrap-typeahead'
import spdxLicenseIds from 'spdx-license-ids'
import deprecatedSpdxLicenseIds from 'spdx-license-ids/deprecated'
import { customLicenseIds } from '../utils/utils'

const identifiers = [...customLicenseIds, ...spdxLicenseIds.sort(), ...deprecatedSpdxLicenseIds.sort()]

export default class SpdxPicker extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  onKeyPress(event, onChange) {
    const instance = this._typeahead.getInstance()
    const isMenuOpen = instance.state.showMenu
    const resultsExist = instance.state.initialItem != null
    const enterPressed = event.key === 'Enter'
    // if user is in mid-selection, don't hijack Enter key
    // i.e. only fire onChange on Enter if menu closed or no results
    if (enterPressed && (!isMenuOpen || !resultsExist)) {
      const { target } = event
      const { value } = target
      value && onChange(value)
    }
  }

  render() {
    const { value, onBlur, onChange, autoFocus } = this.props
    return (
      <div className="editable-editor" data-test-id="spdx-input-picker">
        <Typeahead
          defaultInputValue={value}
          options={identifiers}
          onBlur={onBlur}
          onKeyDown={e => this.onKeyPress(e, onChange)}
          onChange={([first]) => onChange(first)}
          ref={ref => (this._typeahead = ref)}
          bodyContainer
          highlightOnlyResult
          autoFocus={autoFocus}
          selectHintOnEnter
          clearButton
        />
      </div>
    )
  }
}
