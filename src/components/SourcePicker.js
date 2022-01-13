// Copyright (c) Codescoop Oy and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Button, ButtonGroup, FormGroup } from 'react-bootstrap'
import { GitHubSelector, GitHubCommitPicker } from './'
import { getGitHubRevisions } from '../api/clearlyDefined'
import EntitySpec from '../utils/entitySpec'
import { clone } from 'lodash'

class SourcePicker extends Component {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.onSelectComponent = this.onSelectComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onSelectComponent(value, tool) {
    const [namespace, name] = value.name.split('/')
    const component = new EntitySpec(value.type, value.provider, namespace, name)
    component.tool = tool
    this.setState({ selectedComponent: component })
  }

  onChangeComponent(component, newComponent) {
    this.setState({ selectedComponent: newComponent })
  }

  onClick(event) {
    const activeProvider = event.target.name
    this.setState({ activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return (
      <ButtonGroup>
        <Button name="github" onClick={this.onClick} active={activeProvider === 'github'}>
          GitHub
        </Button>
      </ButtonGroup>
    )
  }

  renderActionButton() {
    const { onChange, onClose } = this.props
    return (
      <FormGroup className="pull-right">
        <Button
          bsStyle="success"
          onClick={() => (this.state.selectedComponent ? onChange(this.state.selectedComponent) : onClose())}
        >
          OK
        </Button>
        <Button onClick={() => onClose()}>Cancel</Button>
      </FormGroup>
    )
  }

  commitChanged(component, value) {
    const newComponent = clone(component)
    newComponent.revision = value ? value.sha : null
    this.onChangeComponent(component, newComponent)
  }

  render() {
    const { activeProvider, selectedComponent } = this.state
    const { value } = this.props
    return (
      <Grid className="main-container" id="source-picker">
        <div>{this.renderProviderButtons()}</div>
        <div>{activeProvider === 'github' && <GitHubSelector onChange={this.onSelectComponent} />}</div>
        <div>
          {selectedComponent && activeProvider === 'github' && (
            <GitHubCommitPicker
              allowNew
              request={selectedComponent}
              getGitHubRevisions={path => getGitHubRevisions(this.props.token, path)}
              onChange={this.commitChanged.bind(this, selectedComponent)}
            />
          )}
        </div>
        <div className="source-picker__current-source">
          <a href={selectedComponent ? selectedComponent.url : value} target="_blank" rel="noopener noreferrer">
            {selectedComponent ? selectedComponent.url : value}
          </a>
          {this.renderActionButton()}
        </div>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token
  }
}
export default connect(mapStateToProps)(SourcePicker)
