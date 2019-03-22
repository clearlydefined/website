import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Tag from 'antd/lib/tag'

export default class ActiveFilters extends Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    activeSort: PropTypes.object,
    activeName: PropTypes.string
  }

  render() {
    const { activeFilters, activeSort, activeName } = this.props
    return activeFilters || activeSort || activeName ? (
      <div className="horizontalBlock">
        <p className="right-space">Active Filters:</p>
        <>
          {map(activeFilters, (val, i) => (
            <Tag key={i}>{`${i}:${val}`}</Tag>
          ))}
          {activeSort && <Tag key={'sort'}>{`sort:${activeSort}`}</Tag>}
          {activeName && <Tag key={'name'}>{`name:${activeName}`}</Tag>}
        </>
      </div>
    ) : null
  }
}
