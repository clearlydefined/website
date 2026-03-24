// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '../Navigation/Ui/Autocomplete'
import spdxExceptions from 'spdx-exceptions'

export default class SpdxExceptionPicker extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this._typeahead = React.createRef()
    this.exceptions = [...spdxExceptions].sort()
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      const { value } = event.target
      if (value) {
        this.props.onChange(value)
      }
    }
  }

  onChange = ([first]) => {
    if (first) this.props.onChange(typeof first === 'object' ? first.label : first)
  }

  render() {
    const { value } = this.props
    return (
      <div className="editable-editor" data-test-id="spdx-exception-picker">
        <Autocomplete
          id="spdx-exception-picker"
          key={value}
          defaultInputValue={value}
          options={this.exceptions}
          onKeyDown={this.onKeyPress}
          onChange={this.onChange}
          ref={this._typeahead}
          positionFixed
          selectHintOnEnter
          clearButton
          allowNew
          placeholder="Exception (e.g. Classpath-exception-2.0)"
        />
      </div>
    )
  }
}
