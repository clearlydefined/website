// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiViewPrGetData } from '../actions/ui'
import { ROUTE_VIEW_PR } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'

class PageViewPr extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch, pr_number, token } = this.props

    dispatch(uiNavigation({ to: ROUTE_VIEW_PR }))
    dispatch(uiViewPrGetData(token, pr_number))
  }

  render() {
    return (
      <div>{this.props.componentsState.isFetching ? 'Fetching' : JSON.stringify(this.props.componentsState.item)}</div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    pr_number: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    componentsState: state.ui.view_pr
  }
}

export default connect(mapStateToProps)(PageViewPr)
