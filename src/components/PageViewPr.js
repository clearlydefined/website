// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { uiViewPrGetData, uiViewPrUpdateList } from '../actions/ui'
import { ROUTE_VIEW_PR } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import AbstractPageDefinitions from './AbstractPageDefinitions'

class PageViewPr extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, prNumber, token } = this.props

    dispatch(uiNavigation({ to: ROUTE_VIEW_PR }))
    dispatch(uiViewPrGetData(token, prNumber))
  }

  noRowsRenderer() {
    return <div className="placeholder-message">Fetching details on the components included in the pull request.</div>
  }

  tableTitle() {
    const { prNumber } = this.props
    const linkBack = this.props.url.isFetched ? (
      <a href={this.props.url.item}>#{prNumber}</a>
    ) : (
      `#${prNumber}`
    )
    return <span>Definitions from pull request {linkBack}</span>
  }

  renderSearchBar() {}

  renderButtons() {
    return (
      <div className="pull-right">
        &nbsp;
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasComponents()} onClick={this.doSave}>
          Save
        </Button>
      </div>
    )
  }

  readOnly() {
    return true
  }

  updateList(o) {
    return uiViewPrUpdateList(o)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    prNumber: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    url: state.ui.view_pr.url,
    definitions: state.ui.view_pr.definitions,
    components: state.ui.view_pr.componentList,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList
  }
}

export default connect(mapStateToProps)(PageViewPr)
