// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { uiViewPrGetData } from '../actions/ui'
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
  }

  renderComponent(component) {
    return (
      <div className="view-pr__row">
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

  render() {
    return (
      <div>
        {!this.props.componentsState.isFetched ? 'Fetching' : this.props.componentsState.item.map(this.renderComponent)}
      </div>
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
