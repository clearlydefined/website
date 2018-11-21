// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'
import SuggestionsList from '../components/Navigation/Ui/Suggestions/SuggestionsList'

/**
 * HoC that manage the suggestion functionality for a Component
 * It retrieves suggested data for the specified field and show those into a selectable list
 * @param {*} WrappedComponent
 * @param {*} options
 */

function withSuggestions(WrappedComponent, options = {}) {
  class EnhanceSuggestions extends WrappedComponent {
    render() {
      const { suggestedData, field } = this.props
      return (
        <Fragment>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {super.render()}
            {suggestedData && <SuggestionsList field={field} items={suggestedData} />}
          </div>
        </Fragment>
      )
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceSuggestions)
}

function mapStateToProps(state, props) {
  return {
    suggestedData: get(state.ui.inspect.suggestedData.item, props.field)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default withSuggestions
