import React, { Component } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import { DropdownButton, MenuItem } from 'react-bootstrap'

class FilterList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onFilter: PropTypes.func.isRequired,
    variant: PropTypes.string
  }
  render() {
    const { list, title, id, disabled, onFilter, value, variant } = this.props
    return (
      <DropdownButton
        className="list-button"
        bsStyle={variant || 'default'}
        pullRight
        title={title}
        disabled={disabled}
        id={id}
      >
        {list.map((filterType, index) => {
          return (
            <MenuItem
              className="page-definitions__menu-item"
              key={index}
              onSelect={onFilter}
              eventKey={{ type: id, value: filterType.value }}
            >
              <span>{filterType.label}</span>
              {value && find(value, (filter, filterId) => filterId === id && filter === filterType.value) && (
                <i className="fas fa-check" />
              )}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )
  }
}

export default FilterList
