import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Tag from 'antd/lib/tag'

export default class ActiveFilters extends Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    activeSort: PropTypes.string,
    activeName: PropTypes.string,
    onClear: PropTypes.func
  }

  render() {
    const { activeFilters, activeSort, activeName, onClear } = this.props
    return activeFilters || activeSort || activeName ? (
      <div className="horizontalBlock">
        <p className="right-space">Active Filters:</p>
        <>
          {map(activeFilters, (val, i) => (
            <Tag key={i} closable={true} afterClose={() => onClear('activeFilters', i)}>{`${i}:${val}`}</Tag>
          ))}
          {activeSort && (
            <Tag
              key={'sort'}
              closable={true}
              afterClose={() => onClear('activeSort', activeSort)}
            >{`sort:${activeSort}`}</Tag>
          )}
          {activeName && (
            <Tag key={'name'} closable={true} afterClose={() => onClear('activeName')}>{`name:${activeName}`}</Tag>
          )}
        </>
      </div>
    ) : null
  }
}
