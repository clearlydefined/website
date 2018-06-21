// Copyright (c) 2018, The Linux Foundation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import 'react-select/dist/react-select.css'

const options = [
  { value: 'licensed.declared', label: 'Declared License' },
  { value: 'described.sourceLocation', label: 'Source' },
  { value: 'described.releaseDate', label: 'Release Date' }
]

export default class FilterSelect extends Select {
  static propTypes = {
    onChange: PropTypes.func,
    defaultFilters: PropTypes.array,
    placeholder: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = { value: props.defaultFilters }
    this.filterChange = this.filterChange.bind(this)
  }

  filterChange(value) {
    this.setState({ value })
    const { onChange } = this.props
    onChange && onChange(value)
  }

  render() {
    const { value } = this.state
    const { placeholder, disabled } = this.props
    return (
      <Select
        name="filter"
        multi={true}
        options={options}
        onChange={this.filterChange}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
      />
    )
  }
}
