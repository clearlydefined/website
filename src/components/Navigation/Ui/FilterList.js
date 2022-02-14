import React, { Component } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import { Menu, MenuItem, Button } from '@material-ui/core'

class FilterList extends Component {
  constructor(props) {
    super(props)
    this.state = { menu: null }
  }

  static propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onFilter: PropTypes.func.isRequired,
    className: PropTypes.string
    // variant: PropTypes.string
  }
  handleClose = () => {
    this.setState({ menu: null })
  }
  handleClick = event => {
    this.setState({ menu: event.currentTarget })
  }
  render() {
    const { list, title, id, disabled, onFilter, value, className } = this.props
    return (
      <div className={`w-100 ${className}`}>
        <Button
          className="top-search-side-dropdown w-100"
          id="basic-button"
          aria-haspopup="true"
          aria-expanded={this.state.menu ? 'true' : undefined}
          onClick={this.handleClick}
          disabled={disabled}
          size="large"
          disableRipple
        >
          {title}
        </Button>
        <Menu
          id="basic-menu"
          open={Boolean(this.state.menu)}
          onClose={this.handleClose}
          anchorEl={this.state.menu}
          className="top-search-side-dropdown-items"
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          {list.map((filterType, index) => {
            return (
              <MenuItem
                className="dropdown-items"
                key={index}
                onClick={e => {
                  onFilter({ type: id, value: filterType.value })
                  this.handleClose()
                }}
              >
                <span>{filterType.label}</span>
                {value && find(value, (filter, filterId) => filterId === id && filter === filterType.value) && (
                  <i className="fas fa-check filter-selected-check-icon" />
                )}
              </MenuItem>
            )
          })}
        </Menu>
      </div>
    )
  }
}

export default FilterList
