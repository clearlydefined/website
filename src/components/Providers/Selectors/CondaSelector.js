// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getCondaSearch } from '../../../api/clearlyDefined'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import searchSvg from '../../../images/icons/searchSvg.svg'

export default class CondaSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = { isLoading: false, options: [], focus: false }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(values) {
    const { onChange } = this.props
    const value = values.length === 0 ? null : values[0]
    value && onChange && onChange({ type: 'conda', provider: this.props.provider, name: value.id }, 'package')
  }

  async getOptions(value) {
    try {
      this.setState({ ...this.state, isLoading: true })
      const options = await getCondaSearch(this.props.token, `${this.props.provider}/${value}`)
      this.setState({ ...this.state, options, isLoading: false })
    } catch (error) {
      this.setState({ ...this.state, options: [], isLoading: false })
    }
  }

  render() {
    const { options, isLoading, focus } = this.state
    return (
      <div className={`harvest-searchbar ${focus ? 'active' : ''}`}>
        <div className="search-logo">
          <img src={searchSvg} alt="search" />
        </div>
        <AsyncTypeahead
          id="conda-selector"
          className="harvest-search"
          useCache={false}
          options={options}
          placeholder={'Pick a Conda Package to harvest'}
          onChange={this.onChange}
          labelKey="id"
          onFocus={() => this.setState({ ...this.state, focus: true })}
          onBlur={() => this.setState({ ...this.state, focus: false })}
          clearButton
          highlightOnlyResult
          emptyLabel=""
          selectHintOnEnter
          isLoading={isLoading}
          onSearch={this.getOptions}
        />
      </div>
    )
  }
}
