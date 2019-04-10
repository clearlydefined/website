// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import SuggestionsList from '../components/Navigation/Ui/Suggestions/SuggestionsList'
import EntitySpec from './entitySpec'

/**
 * HoC that manage the suggestion functionality for a Component
 * It retrieves suggested data for the specified field and show those into a selectable list
 */
function withSuggestions(WrappedComponent) {
  class EnhanceSuggestions extends Component {
    constructor(props) {
      super(props)
      this.cmp = React.createRef()
    }

    //Once a suggestion is applied, then it will added as a change for the current field
    applySuggestion = suggestion => {
      this.cmp.current.onChange(suggestion)
    }

    render() {
      const { suggestedData, field } = this.props
      return (
        <>
          <WrappedComponent {...this.props} ref={this.cmp} />
          {suggestedData && <SuggestionsList field={field} items={suggestedData} onSelect={this.applySuggestion} />}
        </>
      )
    }
  }

  return connect(mapStateToProps)(EnhanceSuggestions)
}

function mapStateToProps(state, props) {
  if (!props.definition) return {}
  const coordinates = EntitySpec.fromObject(props.definition.coordinates).toPath()
  const suggestion = get(state.suggestion.bodies.entries, coordinates)
  return {
    suggestedData: suggestion && get(suggestion, props.field)
  }
}

export default withSuggestions
