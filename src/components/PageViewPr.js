// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiViewPrGetData, uiViewPrGetBaseUrl } from '../actions/ui'
import { ROUTE_VIEW_PR } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'
import { DefinitionEntry } from './'

class PageViewPr extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch, pr_number, token } = this.props

    dispatch(uiNavigation({ to: ROUTE_VIEW_PR }))
    dispatch(uiViewPrGetData(token, pr_number))
    dispatch(uiViewPrGetBaseUrl())
  }

  renderComponent(component) {
    return (
      <div key={component.path} className="view-pr__row">
        <DefinitionEntry
          readOnly={true}
          onChange={() => null}
          onCurate={() => null}
          onInspect={() => null}
          renderButtons={() => null}
          component={{ expanded: true }}
          definition={component.current}
          otherDefinition={component.proposed}
          classOnDifference="red"
          activeFacets={[]}
        />
        <DefinitionEntry
          readOnly={true}
          onChange={() => null}
          onCurate={() => null}
          onInspect={() => null}
          renderButtons={() => null}
          component={{ expanded: true }}
          definition={component.proposed}
          otherDefinition={component.current}
          classOnDifference="green"
          activeFacets={[]}
        />
      </div>
    )
  }

  renderContent() {
    if (this.props.componentsState.isFetching)
      return <div className="placeholder-message">Fetching details on the components included in the pull request.</div>
    if (this.props.componentsState.isFetched)
      return <div>{this.props.componentsState.item.map(this.renderComponent)}</div>
    return <div className="placeholder-message">If you continue seeing this message, try reloading the page.</div>
  }

  render() {
    const content = this.renderContent()
    const linkBack = this.props.base_url.isFetched ? (
      <p className="view-pr__link-back">
        <a href={`${this.props.base_url.item.url}/pull/${this.props.pr_number}`}>Back to Github</a>
      </p>
    ) : null
    return (
      <div>
        {content}
        {linkBack}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    pr_number: ownProps.location.pathname.slice(ownProps.match.url.length + 1),
    componentsState: state.ui.view_pr.data,
    base_url: state.ui.view_pr.base_url
  }
}

export default connect(mapStateToProps)(PageViewPr)
