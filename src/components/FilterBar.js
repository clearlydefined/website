// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class FilterBar extends Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    clearOnChange: PropTypes.bool,
    defaultValue: PropTypes.string,
    onSearch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.typeahead = React.createRef()
  }

  onChange(values) {
    const { onChange, clearOnChange } = this.props
    if (values.length) {
      onChange && onChange(values[0])
      // timing hack to work around https://github.com/ericgio/react-bootstrap-typeahead/issues/211
      clearOnChange && setTimeout(() => this.refs.typeahead && this.refs.typeahead.getInstance().clear(), 0)
    }
  }

  filter(option, text) {
    return option.toLowerCase().includes(text.toLowerCase())
  }

  render() {
    const { options, defaultValue, value, onSearch } = this.props
    return (
      <AsyncTypeahead
        ref={this.typeahead}
        placeholder="Component search..."
        onChange={this.onChange}
        options={options.list}
        isLoading={options.isFetching}
        onSearch={onSearch}
        clearButton
        defaultInputValue={(!value && defaultValue) || ''}
        // filterBy={this.filter}
        labelKey="path"
        selected={value && [value]}
      />
    )
  }
}
