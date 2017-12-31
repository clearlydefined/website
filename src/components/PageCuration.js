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

  getStringValue(item) {
    return item ? yaml.safeDump(item, { sortKeys: true }) : ''
  }

  render() {
    const { currentCuration, proposedCuration, currentPackage, proposedPackage } = this.props
    const curationOriginal = this.getStringValue(currentCuration.item)
    const curationValue = this.getStringValue(proposedCuration.item)
    const packageOriginal = this.getStringValue(currentPackage.item)
    const packageValue = this.getStringValue(proposedPackage.item) 
    return (
      <Grid className="main-container">
        <Row className="show-grid">
          <Col md={12} >
            <CurationReview
              currentCuration={curationOriginal}
              currentPackage={packageOriginal}
              newCuration={curationValue}
              newPackage={packageValue}
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