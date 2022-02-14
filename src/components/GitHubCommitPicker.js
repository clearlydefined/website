// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Highlighter } from 'react-bootstrap-typeahead'
import searchSvg from '../images/icons/searchSvg.svg'
import Autocomplete from './Navigation/Ui/Autocomplete'

export default class GitHubCommitPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    request: PropTypes.object.isRequired,
    getGitHubRevisions: PropTypes.func.isRequired,
    defaultInputValue: PropTypes.string,
    allowNew: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      customValues: [],
      options: [],
      focus: false,
      selected: props.request.commit ? [props.request.commit] : []
    }
    this.onChange = this.onChange.bind(this)
    this.filter = this.filter.bind(this)
  }

  componentDidMount() {
    // use this synchronously updated flag to prevent calling setState if getGitHubRevisions returns
    // after component has been unmounted already
    this.isUnmounted = false
    this.getOptions('')
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, selected: nextProps.request.commit ? [nextProps.request.commit] : [] }, () =>
      this.getOptions('')
    )
  }

  componentDidUpdate() {
    if (this.state.shouldUpdate) this.getOptions('')
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  async getOptions(value) {
    try {
      const { request, getGitHubRevisions } = this.props
      const { namespace, name } = request
      const path = name ? `${namespace}/${name}` : name
      const options = await getGitHubRevisions(path)
      !this.isUnmounted && this.setState({ options, shouldUpdate: false })
    } catch (error) {
      !this.isUnmounted && this.setState({ options: [], shouldUpdate: false })
    }
  }

  onChange(values) {
    const { onChange } = this.props
    if (!onChange) return
    let value = values.length === 0 ? null : values[0]

    if (!value) return onChange(value)
    if (value.customOption) {
      value = { tag: value.tag, sha: value.tag }
      this.setState({ ...this.state, customValues: [...this.state.customValues, value] })
    }
    onChange(value)
  }

  renderMenuItemChildren(option, props) {
    const value = option.tag === option.sha ? option.sha : `${option.tag}${option.sha ? ` (${option.sha})` : ''}`
    return <Highlighter search={props.text}>{value}</Highlighter>
  }

  filter(option, props) {
    if (!props.text) return true
    return (
      option.tag.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
      option.sha.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
    )
  }

  render() {
    const { defaultInputValue, allowNew } = this.props
    const { customValues, options, selected, focus } = this.state
    const list = customValues.concat(options)
    return (
      <div onClick={e => e.stopPropagation()}>
        <div className={`harvest-searchbar ${focus ? 'active' : ''}`}>
          <div className="search-logo">
            <img src={searchSvg} alt="search" />
          </div>
          <Autocomplete
            id="github-commit-picker"
            inputProps={{ dataTestId: 'github-commit-picker' }}
            selected={selected}
            options={list}
            labelKey="tag"
            defaultInputValue={defaultInputValue}
            placeholder={
              options.length === 0 ? 'No tags found, enter a commit hash' : 'Pick a tag or enter a commit hash'
            }
            onChange={this.onChange}
            onFocus={() => this.setState({ ...this.state, focus: true })}
            onBlur={() => this.setState({ ...this.state, focus: false })}
            positionFixed
            allowNew={allowNew}
            clearButton
            newSelectionPrefix="SHA:"
            filterBy={this.filter}
            selectHintOnEnter
            renderMenuItemChildren={this.renderMenuItemChildren}
          />
        </div>
      </div>
    )
  }
}
