// Copyright (c) Codescoop Oy and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { GitHubSelector, GitHubCommitPicker } from './'
import EntitySpec from '../utils/entitySpec'
import { clone } from 'lodash'

class SourcePicker extends Component {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github' }
    this.onSelectComponent = this.onSelectComponent.bind(this)
    this.onChangeComponent = this.onChangeComponent.bind(this)
    this.onRemoveComponent = this.onRemoveComponent.bind(this)
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

  onRemoveComponent(component) {
    this.setState({ selectedComponent: null })
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
    return (
      <Button
        className="pull-right"
        bsStyle="success"
        onClick={() => this.props.onChange(this.state.selectedComponent)}
      >
        Select
      </Button>
    )
  }

  noRowsRenderer() {
    return <div className="list-noRows">Use the search box above to select a source.</div>
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
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <Col md={2}>{this.renderProviderButtons()}</Col>
          <Col md={5}>{activeProvider === 'github' && <GitHubSelector onChange={this.onSelectComponent} />}</Col>
          <Col md={5}>
            {selectedComponent &&
              activeProvider === 'github' && (
                <GitHubCommitPicker
                  request={selectedComponent}
                  allowNew={true}
                  token={this.props.token}
                  onChange={this.commitChanged.bind(this, selectedComponent)}
                />
              )}
          </Col>
        </Row>
        <Row>
          <a href={selectedComponent ? selectedComponent.url : value}>
            {selectedComponent ? selectedComponent.url : value}
          </a>
          {this.renderActionButton()}
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
  }
}
export default connect(mapStateToProps)(SourcePicker)
