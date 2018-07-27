// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, Glyphicon } from 'react-bootstrap'

/**
 * Component that render an input type used as Filter
 * It render also a filter icon
 *
 */
class FilterCustomComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filterValue: ''
    }
  }

  /**
   * Updates local state
   * then fire the callback to alert React-Table of the new filter
   *
   */
  changeFilterValue = filterValue => {
    this.setState({ filterValue: filterValue.target.value }, () => this.props.onChange(this.state))
  }

  render() {
    return (
      <FormGroup className="inputBox">
        <FormControl
          type="text"
          onChange={this.changeFilterValue}
          value={this.props.filter ? this.props.filter.value.filterValue : ''}
        />
        <FormControl.Feedback>
          <Glyphicon glyph="filter" />
        </FormControl.Feedback>
      </FormGroup>
    )
  }
}

FilterCustomComponent.propTypes = {
  /**
   * Filter object received from react-table
   */
  filter: PropTypes.object,
  /**
   * Callback function
   */
  onChange: PropTypes.func.isRequired
}

export default FilterCustomComponent
