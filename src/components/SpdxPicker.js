// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '../components/Navigation/Ui/Autocomplete'
import spdxLicenseIds from 'spdx-license-ids'
import deprecatedSpdxLicenseIds from 'spdx-license-ids/deprecated'
import { customLicenseIds } from '../utils/utils'
import LicensePickerUtils from '../components/LicensePicker/utils'

const identifiers = [...customLicenseIds, ...spdxLicenseIds.sort(), ...deprecatedSpdxLicenseIds.sort()]

export default class SpdxPicker extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    promptText: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onChange = this.onChange.bind(this)
    this._typeahead = React.createRef()
  }

  onKeyPress(event, onChange) {
    const instance = this._typeahead.current.typeahead.getInstance()
    const enterPressed = event.key === 'Enter'
    // if user is in mid-selection, don't hijack Enter key
    // i.e. only fire onChange on Enter if menu closed or no results
    if (enterPressed) {
      const { target } = event
      const { value } = target
      value && this.onChange(value, onChange)
    }
  }

  onChange(value, onChange) {
    return LicensePickerUtils.isValidExpression(value) ? onChange(value) : false
  }

  onBlur(event, onBlur) {
    return LicensePickerUtils.isValidExpression(event.target.value) ? onBlur && onBlur(event) : false
  }

  render() {
    const { value, onBlur, onChange, autoFocus, promptText } = this.props
    return (
      <div className="editable-editor" data-test-id="spdx-input-picker">
        <Autocomplete
          id="spdx-picker"
          defaultInputValue={value}
          options={identifiers}
          onBlur={event => this.onBlur(event, onBlur)}
          onKeyDown={e => this.onKeyPress(e, onChange)}
          onChange={([first]) => this.onChange(first, onChange)}
          ref={this._typeahead}
          bodyContainer
          autoFocus={autoFocus}
          selectHintOnEnter
          clearButton
          placeholder={promptText}
          allowNew
        />
      </div>
    )
  }
}
