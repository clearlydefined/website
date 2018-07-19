// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { uiViewPrGetData, uiViewPrGetBaseUrl, uiViewPrUpdateList } from '../actions/ui'
import { ROUTE_VIEW_PR } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import { DefinitionEntry } from './'
import AbstractPageDefinitions from './AbstractPageDefinitions'

class PageViewPr extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, pr_number, token } = this.props

    dispatch(uiNavigation({ to: ROUTE_VIEW_PR }))
    dispatch(uiViewPrGetData(token, pr_number))
    dispatch(uiViewPrGetBaseUrl())
  }

  noRowsRenderer() {
    return <div className="placeholder-message">Fetching details on the components included in the pull request.</div>
  }

  tableTitle() {
    const { pr_number } = this.props
    const linkBack = this.props.base_url.isFetched ? (
      <a href={`${this.props.base_url.item.url}/pull/${pr_number}`}>#{pr_number}</a>
    ) : (
      `#${pr_number}`
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
  const foo = state.ui.view_pr.data.item
  return {
    token: state.session.token,
    pr_number: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    componentsState: state.ui.view_pr.data,
    definitions: state.ui.view_pr.definitions,
    components: state.ui.view_pr.componentList,
    base_url: state.ui.view_pr.base_url,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList
  }
}

export default connect(mapStateToProps)(PageViewPr)
