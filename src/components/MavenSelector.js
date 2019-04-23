// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMavenSearch } from '../api/clearlyDefined'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class MavenSelector extends Component {
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
    const value = values.length === 0 ? null : values[0].id
    if (!value) return
    if (value.indexOf(':') > 0 && !value.endsWith(':')) {
      const name = value.replace(':', '/')
      return onChange && onChange({ type: 'maven', provider: 'mavencentral', name }, 'package')
    }
    this._typeahead._updateText(value + ':')
    this._typeahead._updateSelected([])
  }

  async getOptions(value) {
    try {
      this.setState({ ...this.state, isLoading: true })
      const options = await getMavenSearch(this.props.token, value.replace(':', '/'))
      this.setState({ ...this.state, options, isLoading: false })
    } catch (error) {
      this.setState({ ...this.state, options: [], isLoading: false })
    }
  }

  render() {
    const { options, isLoading } = this.state
    return (
      <AsyncTypeahead
        id="maven-selector"
        ref={component => (this._typeahead = component ? component.getInstance() : this._typeahead)}
        useCache={false}
        options={options}
        placeholder={'Pick a groupId:artifactId to harvest'}
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
