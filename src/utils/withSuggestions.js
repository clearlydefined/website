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
  return class EnhanceSuggestions extends WrappedComponent {
    state = {
      showSuggestions: false
    }

    render() {
      const { suggestedData } = this.props
      const { showSuggestions } = this.state
      console.log(suggestedData)
      return (
        <Fragment>
          <div>
            {super.render()}
            <span>|</span>
            <span
              onClick={this.setState(() => {
                return { showSuggestions: !showSuggestions }
              })}
            >
              Suggestions
            </span>
          </div>
          {showSuggestions && <SuggestionsList items={suggestedData} />}
        </Fragment>
      )
    }
  }
}

function mapStateToProps(state, props) {
  return {
    suggestedData: get(state.ui.inspect.suggestedData, props.field)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSuggestions)
