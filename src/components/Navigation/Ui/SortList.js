// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'

class SortList extends Component {
  static defaultProps = {
    width: 120
  }

  static propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    list: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
    title: PropTypes.string,
    width: PropTypes.number
  }
  render() {
    const { list, title, id, disabled, onSort, width } = this.props
    return (
      <Select
        allowClear
        className="list-button"
        disabled={disabled}
        id={id}
        onChange={onSort}
        placeholder={title}
        style={{ width }}
      >
        {list.map(sortType => (
          <Select.Option className="page-definitions__menu-item" title={sortType.label} value={sortType.value}>
            <span>{sortType.label}</span>
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default SortList
