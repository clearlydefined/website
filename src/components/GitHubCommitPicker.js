// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PortalSelect } from './'

export default class GitHubCommitPicker extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    gotoValue: PropTypes.func,
    backspaceRemoves: PropTypes.bool,
    request: PropTypes.object.isRequired,
  }

  static defaultProps = {
    backspaceRemoves: true,
    gotoValue: value => console.log(value)
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  async getOptions(value) {
    try {
      const { namespace, name } = this.props.request
      const url = `https://api.github.com/repos/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/git/refs/tags`;
      const response = await fetch(url)
      const json = await response.json()
      return {
        options: json.map(item => {
          return { tag: item.ref.slice(10), sha: item.object.sha }
        })
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }

  cleanInput(inputValue) {
    // Strip all whitespace characters from the input
    return inputValue.replace(/[\s]/g, '')
  }

  onChange(value) {
    const { onChange } = this.props
    onChange && onChange(value)
  }

  renderEntry(option) {
    return `${option.tag} (${option.sha})`
  }

  render() {
    const { request, gotoValue, backspaceRemoves } = this.props
    return (
      <div>
        <PortalSelect
          multi={false}
          mode='async'
          value={request.revision}
          onChange={this.onChange}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          onValueClick={gotoValue}
          onInputChange={this.cleanInput}
          valueRenderer={this.renderEntry}
          optionRenderer={this.renderEntry}
          valueKey='sha'
          labelKey='tag'
          loadOptions={this.getOptions}
          clearable
          autosize={false}
          placeholder='Enter a Git SHA1 or tag'
          backspaceRemoves={backspaceRemoves}
        />
      </div>)
  }
}
