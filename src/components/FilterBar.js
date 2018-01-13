// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

export default class FilterBar extends Component {

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    value: null,
    options: {}
  }

  render() {
    const { value, onChange, options } = this.props
    return (
      <Select
        className='filter-select'
        name='filter'
        id='filter'
        placeholder='Component search...'
        value={value}
        onChange={onChange}
        options={options.transformedList}
        isLoading={options.isFetching}
        searchable
        simpleValue
        labelKey='path'
        valueKey='path'
        autosize={false}
      />
    )
  }
}
