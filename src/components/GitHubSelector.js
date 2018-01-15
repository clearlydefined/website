// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select, { Async } from 'react-select';

export default class GitHubSelector extends Component {

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

    const [login, repo] = value.split('/')
    if (!repo && !value.endsWith('/')) {
      const response = await fetch(`https://api.github.com/search/users?q=${login}+repos:%3E0`)
      const json = await response.json()
      return { options: json.items.map(item => { return { id: item.login } }) }
    }
    const response = await fetch(`https://api.github.com/search/repositories?q=${repo}+user:${login}+in:name+fork:true`)
    const json = await response.json()
    return { options: json.items.map(item => { return { id: item.full_name } }) }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    return inputValue.replace(/[\s]/g, '')
  }

  onChange(value) {
    if (!value)
      return
    if (value.indexOf('/') > 0 && !value.endsWith('/'))
      return this.props.onChange && this.props.onChange({ type: 'git', provider: 'github', name: value})
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
      placeholder='Enter a GitHub "login/repo" to harvest'
      backspaceRemoves={backspaceRemoves}
    />)
  }
}
