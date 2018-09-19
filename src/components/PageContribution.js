// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { uiContributionGetData, uiContributionUpdateList } from '../actions/ui'
import { ROUTE_CURATIONS } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import AbstractPageDefinitions from './AbstractPageDefinitions'

class PageContribution extends AbstractPageDefinitions {
  componentDidMount() {
    const { dispatch, prNumber, token } = this.props
    dispatch(uiNavigation({ to: ROUTE_CURATIONS }))
    dispatch(uiContributionGetData(token, prNumber))
  }

  noRowsRenderer() {
    return <div className="placeholder-message">Fetching details on the components included in the pull request.</div>
  }

  tableTitle() {
    const { prNumber } = this.props
    const linkBack = this.props.url.isFetched ? <a href={this.props.url.item}>#{prNumber}</a> : `#${prNumber}`
    return <span>Definitions from pull request {linkBack}</span>
  }

  renderSearchBar() {}

  renderButtons() {
    return (
      <div className="pull-right">
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
    return uiContributionUpdateList(o)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    prNumber: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    url: state.ui.contribution.url,
    definitions: state.ui.contribution.definitions,
    components: state.ui.contribution.componentList,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList
  }
}

export default connect(mapStateToProps)(PageContribution)
