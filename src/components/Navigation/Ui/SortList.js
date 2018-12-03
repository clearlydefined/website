// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import PropTypes from 'prop-types'

class SortList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onSort: PropTypes.func.isRequired
  }
  render() {
    const { list, title, id, disabled, onSort, value } = this.props
    return (
      <DropdownButton className="list-button" bsStyle="default" pullRight title={title} disabled={disabled} id={id}>
        {list.map((sortType, index) => {
          return (
            <MenuItem
              className="page-definitions__menu-item"
              key={index}
              onSelect={onSort}
              eventKey={{ type: id, value: sortType.value }}
            >
              <span>{sortType.label}</span>
              {value === sortType.value && <i className="fas fa-check" />}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )
  }
}

export default SortList
