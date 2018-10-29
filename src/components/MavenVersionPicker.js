// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMavenRevisions } from '../api/clearlyDefined'
import { Typeahead } from 'react-bootstrap-typeahead'

export default class MavenVersionPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    request: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { customValues: [], options: [], selected: props.request.revision ? [props.request.revision] : [] }
    this.onChange = this.onChange.bind(this)
    this.filter = this.filter.bind(this)
  }

  componentDidMount() {
    this.getOptions('')
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => ({
      ...prevState,
      selected: nextProps.request.revision ? [nextProps.request.revision] : []
    }))
  }

  async getOptions(value) {
    try {
      const { namespace, name } = this.props.request
      const path = namespace ? `${namespace}/${name}` : name
      const options = await getMavenRevisions(this.props.token, path.replace(':', '/'))
      this.setState({ ...this.state, options })
    } catch (error) {
      console.log(error)
      this.setState({ ...this.state, options: [] })
    }
  }

  onChange(values) {
    const { onChange } = this.props
    if (!onChange) return
    let value = values.length === 0 ? null : values[0]
    if (!value) return onChange(value)
    if (value.customOption) {
      value = value.label
      this.setState({ ...this.state, customValues: [...this.state.customValues, value] })
    }
    onChange(value)
  }

  filter(option, text) {
    if (this.props.request.revision) return true
    return option.toLowerCase().indexOf(text.toLowerCase()) !== -1
  }

  render() {
    const { customValues, options, selected } = this.state
    const list = customValues.concat(options)
    return (
      <Typeahead
        selected={selected}
        options={list}
        // labelKey='id'
        placeholder={options.length === 0 ? 'Could not fetch versions, type Maven version' : 'Pick a Maven version'}
        onChange={this.onChange}
        bodyContainer
        clearButton
        allowNew
        newSelectionPrefix="Version:"
        emptyLabel=""
        filterBy={this.filter}
        selectHintOnEnter
      />
    )
  }
}
