// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

export default class FilterBar extends Component {

  constructor(props) {
    super(props)
    this.state = { options: [] }
  }

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    value: null,
    options: []
  }

  componentWillReceiveProps(newProps) {
    const list = newProps.options
    if (list.isFetching)
      return
    if (!list.list || list.list.length === 0)
      return this.setState({ ...this.state, options: [] })
    this.setState({
      ...this.state,
      options: list.list.map(entry => { return { path: entry } })
    })
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
        options={this.state.options}
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
