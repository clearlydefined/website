import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'

class FilterList extends Component {
  static defaultProps = {
    width: 120
  }

  static propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    list: PropTypes.array.isRequired,
    onFilter: PropTypes.func.isRequired,
    title: PropTypes.string,
    width: PropTypes.number
  }
  render() {
    const { list, title, id, disabled, onFilter, width } = this.props
    return (
      <Select
        allowClear
        className="list-button"
        disabled={disabled}
        id={id}
        onChange={e => onFilter(e, id)}
        placeholder={title}
        style={{ width }}
      >
        {list.map(filterType => (
          <Select.Option className="page-definitions__menu-item" title={filterType.label} key={filterType.value}>
            <span>{filterType.label}</span>
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default FilterList
