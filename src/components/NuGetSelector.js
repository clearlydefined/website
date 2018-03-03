// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default class NuGetSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = { isLoading: false, options: [] }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(values) {
    const { onChange } = this.props
    const value = values.length === 0 ? null : values[0]
    value && onChange && onChange({ type: 'npm', provider: 'npmjs', name: value.id }, 'package')
  }

  async getOptions(value) {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { options, isLoading } = this.state
    return (
      <AsyncTypeahead
        options={options}
        placeholder={'NuGet support coming soon...'}
        onChange={this.onChange}
        labelKey='id'
        disabled
        clearButton
        highlightOnlyResult
        emptyLabel=''
        selectHintOnEnter
        isLoading={isLoading}
        onSearch={this.getOptions}
      />)
  }
}
