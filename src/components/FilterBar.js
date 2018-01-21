// Copyright (c) Microsoft Corporation. All rights reserved.
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
    className: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.filter = this.filter.bind(this)
  }

  onChange(values) {
    this.props.onChange && values.length && this.props.onChange(values[0].path)
  }

  
  filter(option, text) {
    if (this.props.value)
      return true;
    return option.path.toLowerCase().indexOf(text.toLowerCase()) !== -1;
  }

  render() {
    const { options } = this.props
    return (
      <Typeahead
        placeholder='Component search...'
        onChange={this.onChange}
        options={options.transformedList}
        isLoading={options.isFetching}
        clearButton
        filterBy={this.filter}
        labelKey='path'
      />
    )
  }
}
