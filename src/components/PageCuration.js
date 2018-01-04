// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiNavigation, } from '../actions/ui'
import { Grid, Row, Col } from 'react-bootstrap'
import { CurationReview, ProposePrompt } from './'
import { ROUTE_CURATION } from '../utils/routingConstants'
import EntitySpec from '../utils/entitySpec'
import { getCurationAction, curateAction } from '../actions/curationActions'
import { getPackageAction, previewPackageAction } from '../actions/packageActions'

class PageCuration extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.doPropose = this.doPropose.bind(this)
    this.doAction = this.doAction.bind(this)
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
    dispatch(previewPackageAction(token, currentSpec, {}))
  }

  doPropose(description) {
    const { dispatch, token } = this.props
    const { proposal, entitySpec } = this.state
    const spec = { description, patch: proposal }
    dispatch(curateAction(token, entitySpec, spec))
  }

  doMerge(spec) {
    const url = `https://github.com/clearlydefined/curated-data-dev/pull/${spec.pr}`;
    window.open(url, '_blank');
  }

  doAction(proposal) {
    const { entitySpec } = this.state
    if (entitySpec.pr)
      return this.doMerge(entitySpec)
    this.setState({ ...this.state, proposal })
    this.refs.proposeModal.open()
  }

  render() {
    const { entitySpec } = this.state
    if (!entitySpec)
      return 'Navigate to a specific curation with a URL like https://clearlydefined.io/curation/npm/npmjs/-/lodash/4.17.4'
    const { currentCuration, proposedCuration, currentPackage, rawSummary } = this.props
    // wait to render until we have everything
    if (!(currentCuration.isFetched && currentPackage.isFetched && rawSummary.isFetched))
      return 'Loading the curations for the requested component'
    if (entitySpec.pr && !proposedCuration.isFetched)
      return 'Loading the curations for the requested component'
    const curationOriginal = currentCuration.item
    const curationValue = proposedCuration.item
    const packageOriginal = currentPackage.item
    const packageValue = rawSummary.item
    const actionText = entitySpec.pr ? 'Show on GitHub' : 'Propose'
    return (
      <Grid className="main-container">
        <Row className="show-grid">
          <ProposePrompt ref="proposeModal" proposeHandler={this.doPropose} />
          <Col md={12} >
            <CurationReview
              curationOriginal={curationOriginal}
              curationValue={curationValue}
              packageOriginal={packageOriginal}
              rawSummary={packageValue}
              actionHandler={this.doAction}
              actionText={actionText} />
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
    rawSummary: state.package.preview
  }
}
export default connect(mapStateToProps)(PageCuration)