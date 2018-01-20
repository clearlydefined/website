// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PortalSelect } from './'
import { getGitHubRevisions } from '../api/clearlyDefined'

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
    this.state = { creatable: true }
    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cleanInput = this.cleanInput.bind(this)
  }

  async getOptions(value) {
    try {
      const { namespace, name } = this.props.request
      const path = name ? `${namespace}/${name}` : name
      const options = await getGitHubRevisions(this.props.token, path)
      return { options }
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
    return option.tag === option.sha ? option.sha : `${option.tag} (${option.sha})`
  }

  newOptionCreator({ label, labelKey, valueKey }) {
    return { tag: label, sha: label }
    // return { tag: label, sha: label }
  }

  render() {
    const { request, gotoValue, backspaceRemoves } = this.props
    const { creatable } = this.state
    const noResults = <div/>
    return (
      <div>
        <PortalSelect
          multi={false}
          mode={creatable ? 'asyncCreatable' : 'async'}
          value={request.revision ? this.newOptionCreator({ label: request.revision }) : null}
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
          placeholder={this.state.creatable ? 'No tags found, enter a commit hash' : 'Pick a tag or enter a commit hash'}
          backspaceRemoves={backspaceRemoves}
          newOptionCreator={this.newOptionCreator}
          noResultsText={noResults}
        />
      </div>)
  }
}
