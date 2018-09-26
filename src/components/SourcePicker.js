// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import { HarvestQueueList, GitHubSelector, Section } from './'
import EntitySpec from '../utils/entitySpec'

export default class SourcePicker extends Component {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'github', contentSeq: 0 }
    this.onAddRequest = this.onAddRequest.bind(this)
    this.onChangeRequest = this.onChangeRequest.bind(this)
    this.onRemoveRequest = this.onRemoveRequest.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  onAddRequest(value, tool) {
    const [namespace, name] = value.name.split('/')
    const path = [value.type, value.provider, name ? namespace : '-', name || namespace].join('/')
    const request = EntitySpec.fromPath(path)
    request.tool = tool
    this.setState({ selectedComponent: request, contentSeq: this.state.contentSeq + 1 })
  }

  onChangeRequest(request, newRequest) {
    this.setState({ selectedComponent: newRequest })
  }

  onRemoveRequest(request) {
    this.setState({ selectedComponent: null })
  }

  onClick(event, thing) {
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

  render() {
    const { activeProvider, selectedComponent, contentSeq } = this.state
    const { token, value } = this.props
    return (
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <Col md={6}>{this.renderProviderButtons()}</Col>
          <Col md={6}>{activeProvider === 'github' && <GitHubSelector onChange={this.onAddRequest} />}</Col>
        </Row>
        <Section name={selectedComponent ? selectedComponent.url : value} actionButton={this.renderActionButton()}>
          <div className="section-body">
            <HarvestQueueList
              list={selectedComponent ? [selectedComponent] : []}
              listHeight={500}
              onRemove={this.onRemoveRequest}
              onChange={this.onChangeRequest}
              githubToken={token}
              contentSeq={contentSeq}
              noRowsRenderer={this.noRowsRenderer}
            />
          </div>
        </Section>
      </Grid>
    )
  }
}
