// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select, { Async } from 'react-select';

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
  }

  // version of getting options from NpmSearch. They seem somewhat broken right now so leaving here but disabling
  // async getOptionsNpmSearch(value) {
  //   if (!value) 
  //     return Promise.resolve({ options: [] })
  //   const response = await fetch(`https://npmsearch.com/query?q=${value}&fields=name`)
  //   const json = await response.json()
  //   const options = json.results.map(entry => { return { id: entry.name[0]}})
  //   return { options }
  // }

  async getOptions(value) {
    if (!value) 
      return Promise.resolve({ options: [] })
    // TODO decide if we want to tone down their scoring effect
    const response = await fetch(`https://api.npms.io/v2/search?q=${value}`)
    const json = await response.json()
    const options = json.results.map(entry => { return { id: entry.package.name}})
    return { options }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    return inputValue.replace(/[\s]/g, '')
  }

  render() {
    const { onChange, gotoValue, backspaceRemoves } = this.props
    return (<Async
      multi={false}
      onChange={onChange}
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
