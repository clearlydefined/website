// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getNpmSearch } from '../api/clearlyDefined'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class NpmSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func
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
      this.setState({ ...this.state, isLoading: true })
      const options = await getNpmSearch(this.props.token, value)
      this.setState({ ...this.state, options, isLoading: false })
    } catch (error) {
      this.setState({ ...this.state, options: [], isLoading: false })
    }
  }

  render() {
    const { options, isLoading } = this.state
    return (
      <AsyncTypeahead
        id="npm-selector"
        inputProps={{ dataTestId: 'npm-selector' }}
        useCache={false}
        options={options}
        placeholder={'Pick an NPM to harvest'}
        onChange={this.onChange}
        labelKey="id"
        clearButton
        highlightOnlyResult
        emptyLabel=""
        selectHintOnEnter
        isLoading={isLoading}
        onSearch={this.getOptions}
      />
    )
  }
}
