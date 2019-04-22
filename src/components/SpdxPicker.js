// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '../components/Navigation/Ui/Autocomplete'
import spdxLicenseIds from 'spdx-license-ids'
import deprecatedSpdxLicenseIds from 'spdx-license-ids/deprecated'
import { customLicenseIds } from '../utils/utils'

const identifiers = [...customLicenseIds, ...spdxLicenseIds.sort(), ...deprecatedSpdxLicenseIds.sort()]

export default class SpdxPicker extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    promptText: PropTypes.string
  }

  render() {
    const { value, onBlur, onChange, autoFocus, promptText } = this.props
    return (
      <div className="editable-editor" data-test-id="spdx-input-picker">
        <Autocomplete
          id="spdx-picker"
          defaultInputValue={value}
          options={identifiers}
          onBlur={onBlur}
          onChange={([first]) => onChange(first)}
          ref={ref => (this._typeahead = ref)}
          bodyContainer
          highlightOnlyResult
          autoFocus={autoFocus}
          selectHintOnEnter
          clearButton
          placeholder={promptText}
        />
      </div>
    )
  }
}
