// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getGitHubSearch } from '../api/clearlyDefined'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import searchSvg from '../images/icons/searchSvg.svg'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class GitHubSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      namespace: { isLoading: false, options: [], focus: false },
      component: { isLoading: false, options: [], focus: false }
    }
    this.getOptions = this.getOptions.bind(this)
    this.getComponentOptions = this.getComponentOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onComponentChange = this.onComponentChange.bind(this)
    this._componentselector = React.createRef()
  }

  onChange(values) {
    const value = values.length === 0 ? null : values[0].id
    return this.setState(
      state => {
        return { selectedNamespace: value, selectedComponent: null, component: { ...state.component, options: [] } }
      },
      () => {
        this._componentselector && this._componentselector.getInstance().clear()
      }
    )
  }

  onComponentChange(values) {
    const { onChange } = this.props
    const value = values.length === 0 ? null : values[0].id
    if (!value) return
    this.setState(
      { selectedComponent: value },
      () => onChange && onChange({ type: 'git', provider: 'github', name: value }, 'source')
    )
  }

  async getOptions(value) {
    try {
      this.setState(state => {
        return { namespace: { ...state.namespace, isLoading: true } }
      })
      const options = await getGitHubSearch(this.props.token, value)
      this.setState({ namespace: { options: options, isLoading: false } })
    } catch (error) {
      this.setState({ namespace: { options: [], isLoading: false } })
    }
  }

  async getComponentOptions(value) {
    try {
      this.setState(state => {
        return { component: { ...state.component, isLoading: true } }
      })
      const options = await getGitHubSearch(this.props.token, `${this.state.selectedNamespace}/${value}`)
      this.setState({ component: { options: options, isLoading: false } })
    } catch (error) {
      this.setState({ component: { options: [], isLoading: false } })
    }
  }

  render() {
    const { namespace, component } = this.state
    return (
      <div className="horizontalBlock">
        <div className={`harvest-searchbar ${namespace.focus ? 'active' : ''}`}>
          <div className="search-logo">
            <img src={searchSvg} alt="search" />
          </div>
          <AsyncTypeahead
            id="github-namespace-selector"
            inputProps={{ dataTestId: 'github-namespace-selector' }}
            className="selector-picker harvest-search"
            ref={component => (this._typeahead = component ? component.getInstance() : this._typeahead)}
            useCache={false}
            onFocus={() => this.setState({ ...this.state, namespace: { ...this.state.namespace, focus: true } })}
            onBlur={() => this.setState({ ...this.state, namespace: { ...this.state.namespace, focus: false } })}
            options={namespace.options}
            placeholder={'User / Organization'}
            onChange={this.onChange}
            labelKey="id"
            clearButton
            highlightOnlyResult
            selectHintOnEnter
            isLoading={namespace.isLoading}
            onSearch={this.getOptions}
          />
        </div>
        <div className={`harvest-searchbar ${component.focus ? 'active' : ''}`}>
          <div className="search-logo">
            <img src={searchSvg} alt="search" />
          </div>
          <AsyncTypeahead
            id="github-component-selector"
            className="selector-picker harvest-search"
            inputProps={{ dataTestId: 'github-component-selector' }}
            ref={typeahead => (this._componentselector = typeahead)}
            useCache={false}
            onFocus={() => this.setState({ ...this.state, component: { ...this.state.component, focus: true } })}
            onBlur={() => this.setState({ ...this.state, component: { ...this.state.component, focus: false } })}
            options={component.options}
            placeholder={'Repo'}
            onChange={this.onComponentChange}
            labelKey={option => option.id.substring(option.id.indexOf('/') + 1)}
            clearButton
            highlightOnlyResult
            selectHintOnEnter
            isLoading={component.isLoading}
            onSearch={this.getComponentOptions}
          />
        </div>
      </div>
    )
  }
}
