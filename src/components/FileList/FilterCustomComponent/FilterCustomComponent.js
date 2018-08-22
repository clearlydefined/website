// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormGroup, Glyphicon } from 'react-bootstrap'

/**
 * Component that renders an input type used as Filter Component
 * It also renders an icon
 */
class FilterCustomComponent extends PureComponent {
  /**
   * Alerts React-Table of the new filter
   */
  changeFilterValue = filterValue => {
    this.props.onChange({ filterValue: filterValue.target.value })
  }

  render() {
    const { filter } = this.props
    return (
      <FormGroup className="inputBox">
        <FormControl type="text" onChange={this.changeFilterValue} value={filter ? filter.value.filterValue : ''} />
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
   * React-Table callback function
   */
  onChange: PropTypes.func.isRequired
}

export default FilterCustomComponent
