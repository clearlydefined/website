// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select, { Async } from 'react-select';

export default class MavenSelector extends Component {

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
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  async getOptions(value) {
    if (!value) 
      return Promise.resolve({ options: [] })
    const response = await fetch(`http://npmsearch.com/query?q=${value}&fields=name`)
    const json = await response.json()
    const options = json.results.map(entry => { return { id: entry.name[0]}})
    return { options }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    // return inputValue.replace(/[\s]/g, '')
    return ''  // strip all chars as Maven is not yet supported
  }

  onChange(value) {
    if (!value)
      return
    if (value.indexOf('/') > 0 && !value.endsWith('/'))
      return this.props.onChange(value)
    const newValue = value + '/'
    this.select.setInputValue(newValue)
  }

  render() {
    const { gotoValue, backspaceRemoves } = this.props
    const kids = props => <Select {...props}
      ref={
        select => this.select = this.select || select}
    />
    return (<Async
      children={kids}
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
      placeholder='Maven support coming soon...'
      backspaceRemoves={backspaceRemoves}
    />)
  }
}
