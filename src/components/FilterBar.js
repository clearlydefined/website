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
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.typeahead = React.createRef()
  }

  onChange(values) {
    const { onChange, clearOnChange, onClear } = this.props
    if (values.length) {
      onChange && onChange(values[0])
      // timing hack to work around https://github.com/ericgio/react-bootstrap-typeahead/issues/211
      clearOnChange && setTimeout(() => this.refs.typeahead && this.refs.typeahead.getInstance().clear(), 0)
    } else {
      onClear && onClear()
    }
  }

  filter(option, text) {
    return option.toLowerCase().includes(text.toLowerCase())
  }

  clear() {
    this.typeahead && this.typeahead.getInstance().clear()
  }

  render() {
    const { options, value, onSearch } = this.props
    return (
      <AsyncTypeahead
        id="filter-bar"
        className="filter-bar"
        ref={typeahead => (this.typeahead = typeahead)}
        useCache={false}
        placeholder="Component search..."
        onChange={this.onChange}
        options={options.list}
        isLoading={options.isFetching}
        onSearch={onSearch}
        clearButton
        labelKey="path"
        selected={value ? [value] : []}
      />
    )
  }
}
