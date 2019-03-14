import React, { Component } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import { DropdownButton, MenuItem, Button } from 'react-bootstrap'

class FilterList extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onFilter: PropTypes.func.isRequired,
    variant: PropTypes.string,
    allowReset: PropTypes.bool,
    onReset: PropTypes.func
  }

  static defaultProps = {
    allowReset: false
  }

  render() {
    const { list, title, id, disabled, onFilter, value, variant, allowReset, onReset } = this.props
    return (
      <div className={'horizontalBlock'}>
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
        {allowReset && (
          <Button bsStyle="link" onClick={onReset}>
            <i className="fas fa-times" />
          </Button>
        )}
      </div>
    )
  }
}

export default FilterList
