// (c) Copyright 2022, SAP SE and ClearlyDefined contributors. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getCocoaPodsSearch } from '../../../api/clearlyDefined'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import searchSvg from '../../../images/icons/searchSvg.svg'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class CocoaPodsSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = { isLoading: false, options: [], focus: true }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(values) {
    const { onChange } = this.props
    const value = values.length === 0 ? null : values[0]
    value && onChange && onChange({ type: 'pod', provider: 'cocoapods', name: value.id }, 'package')
  }

  async getOptions(value) {
    try {
      this.setState({ ...this.state, isLoading: true })
      const options = await getCocoaPodsSearch(this.props.token, value)
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
          id="pod-selector"
          className="harvest-search"
          useCache={false}
          options={options}
          placeholder={'Pick a CocoaPod to harvest'}
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
