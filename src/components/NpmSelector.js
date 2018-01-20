// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Async } from 'react-select';
import { getNpmSearch } from '../api/clearlyDefined'

export default class NpmSelector extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    gotoValue: PropTypes.func,
    backspaceRemoves: PropTypes.bool
  }

  static defaultProps = {
    backspaceRemoves: true,
    gotoValue: value => console.log(value)
  }

  constructor(props) {
    super(props)
    this.getOptions = this.getOptions.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(value) {
    const { onChange } = this.props
    onChange && onChange({ type: 'npm', provider: 'npmjs', name: value})
  }

  async getOptions(value) {
    if (!value)
      return Promise.resolve({ options: [] })
    const options = await getNpmSearch(this.props.token, value)
    return { options }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    return inputValue.replace(/[\s]/g, '')
  }

  render() {
    const { gotoValue, backspaceRemoves } = this.props
    return (<Async
      multi={false}
      onChange={this.onChange}
      onBlurResetsInput={false}
      onCloseResetsInput={false}
      onValueClick={gotoValue}
      onInputChange={this.cleanInput}
      valueKey='id'
      labelKey='id'
      loadOptions={this.getOptions}
      simpleValue
      clearable
      placeholder='Enter an NPM name to harvest'
      backspaceRemoves={backspaceRemoves}
    />)
  }
}
