// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiNavigation, } from '../actions/ui'
import { Grid, Row, Col } from 'react-bootstrap'
import { CurationReview } from './'
import { ROUTE_CURATION } from '../utils/routingConstants'
import EntitySpec from '../utils/entitySpec'
import { getCurationAction } from '../actions/curationActions'
import { getPackageAction } from '../actions/packageActions'
import yaml from 'js-yaml'

class PageCuration extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onCurationChange = this.onCurationChange.bind(this)
  }

  componentDidMount() {
    const { dispatch, path } = this.props
    this.handleNewSpec(path)
    dispatch(uiNavigation({ to: ROUTE_CURATION }))
  }

  componentWillReceiveProps(newProps) {
    // If the spec is changing, kick off some loading to get all the state in order
    const newPath = newProps.path
    if (newPath && this.props.path !== newPath)
      this.handleNewUser(newPath)
  }

  // A new spec has been seleted, fetch all the details
  handleNewSpec(path) {
    if (!path)
      return
    const { dispatch, token } = this.props
    const fullSpec = EntitySpec.fromUrl('cd:' + path);
    this.setState({ ...this.state, entitySpec: fullSpec })
    const currentSpec = Object.assign(Object.create(fullSpec), fullSpec, { pr: null });
    if (fullSpec.pr) {
      dispatch(getCurationAction(token, fullSpec))
      dispatch(getPackageAction(token, fullSpec))
    }
    dispatch(getCurationAction(token, currentSpec))
    dispatch(getPackageAction(token, currentSpec))
  }

  onCurationChange(newValue) {

  }

  getStringValue(item, revision) {
    if (!item)
      return ''
    let effectiveItem = item
    if (revision)
      effectiveItem = item.revisions ? item.revisions[revision] : ''
    return effectiveItem ? yaml.safeDump(effectiveItem) : ''
  }

  render() {
    const { entitySpec } = this.state
    if (!entitySpec)
      return null
    const { currentCuration, proposedCuration, currentPackage, proposedPackage } = this.props
    const curationOriginal = this.getStringValue(currentCuration.item, entitySpec.revision)
    const curationValue = this.getStringValue(proposedCuration.item, entitySpec.revision)
    const packageOriginal = this.getStringValue(currentPackage.item)
    const packageValue = this.getStringValue(proposedPackage.item)
    const currentSummary = packageOriginal
    return (
      <Grid className="main-container">
        <Row className="show-grid">
          <Col md={12} >
            <CurationReview
              currentCuration={curationOriginal}
              currentPackage={packageOriginal}
              newCuration={curationValue}
              currentSummary={currentSummary}
              onChange={this.onCurationChange} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    path: ownProps.location.pathname.slice(ownProps.match.url.length),
    token: state.session.token,
    currentCuration: state.curation.current,
    currentPackage: state.package.current,
    proposedCuration: state.curation.proposed,
    proposedPackage: state.package.proposed,
  }
}
export default connect(mapStateToProps)(PageCuration)