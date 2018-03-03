// Copyright (c) Microsoft Corporation and others. Made available under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';

export default class FilterBar extends Component {

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any,
    onChange: PropTypes.func,
    clearOnChange: PropTypes.bool,
    defaultValue: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.filter = this.filter.bind(this)
  }

  onChange(values) {
    const { onChange, clearOnChange } = this.props
    if (values.length) {
      onChange && onChange(values[0].path)
      // timing hack to work around https://github.com/ericgio/react-bootstrap-typeahead/issues/211
      clearOnChange && setTimeout(() => this.refs.typeahead.getInstance().clear(), 0);
    }
  }

  filter(option, text) {
    if (this.props.value)
      return true;
    return option.path.toLowerCase().indexOf(text.toLowerCase()) !== -1;
  }

  render() {
    const { options, defaultValue } = this.props
    return (
      <Typeahead
        ref='typeahead'
        placeholder='Component search...'
        onChange={this.onChange}
        options={options.transformedList}
        isLoading={options.isFetching}
        clearButton
        defaultInputValue={defaultValue || ''}
        filterBy={this.filter}
        labelKey='path'
      />
    )
  }
}
