// Copyright (c) Codescoop Oy and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import { GitHubSelector, GitHubCommitPicker } from './'
import { getGitHubRevisions } from '../api/clearlyDefined'
import EntitySpec from '../utils/entitySpec'
import { clone } from 'lodash'
import { PropTypes } from 'prop-types'

class SourceLocationPicker extends Component {
  constructor(props) {
    super(props)
    this.state = { activeProvider: this.props.activeProvider }
    this.onSelectComponent = this.onSelectComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.onProviderClick = this.onProviderClick.bind(this)
  }

  static propTypes = {
    token: PropTypes.string,
    value: PropTypes.string,
    activeProvider: PropTypes.string,
    onChangeComponent: PropTypes.func.isRequired
  }

  static defaultProps = {
    value: '',
    activeProvider: 'github'
  }

  onSelectComponent(value, tool) {
    const [namespace, name] = value.name.split('/')
    const component = new EntitySpec(value.type, value.provider, namespace, name)
    component.tool = tool
    this.onChangeComponent(component)
  }

  onChangeComponent(component) {
    const { onChangeComponent } = this.props
    this.setState({ ...this.state, selectedComponent: component })
    onChangeComponent(component)
  }

  onProviderClick(event) {
    const activeProvider = event.target.name
    this.setState({ activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return (
      <ButtonGroup>
        <Button name="github" onClick={this.onProviderClick} active={activeProvider === 'github'}>
          GitHub
        </Button>
      </ButtonGroup>
    )
  }

  commitChanged(component, value) {
    const newComponent = clone(component)
    newComponent.revision = value ? value.sha : null
    this.onChangeComponent(newComponent)
  }

  render() {
    const { activeProvider, selectedComponent } = this.state
    const { token, value } = this.props

    return (
      <>
        <div>{this.renderProviderButtons()}</div>
        <div>{activeProvider === 'github' && <GitHubSelector onChange={this.onSelectComponent} />}</div>
        <div>
          {selectedComponent && activeProvider === 'github' && (
            <GitHubCommitPicker
              allowNew
              request={selectedComponent}
              getGitHubRevisions={path => getGitHubRevisions(token, path)}
              onChange={this.commitChanged.bind(this, selectedComponent)}
            />
          )}
        </div>
        <div className="source-picker__current-source">
          <a href={selectedComponent ? selectedComponent.url : value} target="_blank" rel="noopener noreferrer">
            {selectedComponent ? selectedComponent.url : value}
          </a>
        </div>
      </>
    )
  }
}

export default SourceLocationPicker
