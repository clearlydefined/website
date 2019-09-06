// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { ROUTE_HARVEST } from '../../../../utils/routingConstants'
import { harvestAction } from '../../../../actions/harvestActions'
import {
  HarvestQueueList,
  GitHubSelector,
  NpmSelector,
  MavenSelector,
  NuGetSelector,
  CrateSelector,
  DebianSelector,
  ComposerSelector,
  PyPiSelector,
  RubyGemsSelector,
  Section
} from '../../../'
import { uiNavigation, uiHarvestUpdateQueue, uiNotificationNew } from '../../../../actions/ui'
import EntitySpec from '../../../../utils/entitySpec'
import ProviderButtons from '../../Ui/ProviderButtons'

class PageHarvest extends Component {
  constructor(props) {
    super(props)
    this.state = { activeProvider: 'npmjs' }
    this.harvestHandler = this.harvestHandler.bind(this)
    this.onAddRequest = this.onAddRequest.bind(this)
    this.onRemoveRequest = this.onRemoveRequest.bind(this)
    this.onChangeRequest = this.onChangeRequest.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_HARVEST }))
  }

  harvestHandler(spec) {
    const { dispatch, token, queue } = this.props
    dispatch(uiNotificationNew({ type: 'info', message: 'Harvesting started.', timeout: 5000 }))
    const requests = queue.list.map(entry => {
      return { tool: entry.tool || entry.type, coordinates: entry.toPath(), policy: entry.policy }
    })
    dispatch(harvestAction(token, requests))
    // TODO clear the harvest queue when everything is successfully queued
  }

  onAddRequest(value, tool) {
    const [namespace, name] = value.name.split('/')
    const path = [value.type, value.provider, name ? namespace : '-', name || namespace].join('/')
    const request = EntitySpec.fromPath(path)
    request.tool = tool
    this.props.dispatch(uiHarvestUpdateQueue({ add: request }))
  }

  onRemoveRequest(request) {
    this.props.dispatch(uiHarvestUpdateQueue({ remove: request }))
  }

  onChangeRequest(request, newRequest) {
    this.props.dispatch(uiHarvestUpdateQueue({ update: request, value: newRequest }))
  }

  onClick(activeProvider) {
    this.setState({ ...this.state, activeProvider })
  }

  renderProviderButtons() {
    const { activeProvider } = this.state
    return <ProviderButtons activeProvider={activeProvider} onClick={this.onClick} />
  }

  renderActionButton() {
    return (
      <Button className="pull-right" bsStyle="success" onClick={this.harvestHandler}>
        Harvest
      </Button>
    )
  }

  noRowsRenderer() {
    return <div className="list-noRows">Use the search box above to add components to harvest.</div>
  }

  render() {
    const { activeProvider } = this.state
    const { queue } = this.props
    return (
      <Grid className="main-container flex-column">
        <Row className="show-grid spacer">
          <Col md={6}>{this.renderProviderButtons()}</Col>
          <Col md={6}>
            {activeProvider === 'github' && <GitHubSelector onChange={this.onAddRequest} />}
            {activeProvider === 'mavencentral' && <MavenSelector onChange={this.onAddRequest} />}
            {activeProvider === 'npmjs' && <NpmSelector onChange={this.onAddRequest} />}
            {activeProvider === 'nuget' && <NuGetSelector onChange={this.onAddRequest} />}
            {activeProvider === 'cratesio' && <CrateSelector onChange={this.onAddRequest} />}
            {activeProvider === 'packagist' && <ComposerSelector onChange={this.onAddRequest} />}
            {activeProvider === 'pypi' && <PyPiSelector onChange={this.onAddRequest} />}
            {activeProvider === 'rubygems' && <RubyGemsSelector onChange={this.onAddRequest} />}
            {activeProvider === 'debian' && <DebianSelector onChange={this.onAddRequest} />}
          </Col>
        </Row>
        <Section className="flex-grow-column" name={'Components to harvest'} actionButton={this.renderActionButton()}>
          <div className="section-body flex-grow">
            <HarvestQueueList
              list={queue.list}
              onRemove={this.onRemoveRequest}
              onChange={this.onChangeRequest}
              noRowsRenderer={this.noRowsRenderer}
            />
          </div>
        </Section>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    queue: state.ui.harvest.requestQueue
  }
}
export default connect(mapStateToProps)(PageHarvest)
