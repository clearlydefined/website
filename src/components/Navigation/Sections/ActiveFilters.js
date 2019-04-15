import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import Tag from 'antd/lib/tag'
import { Button } from 'react-bootstrap'

export default class ActiveFilters extends Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    activeSort: PropTypes.string,
    activeName: PropTypes.string,
    onClear: PropTypes.func,
    onClearAll: PropTypes.func
  }

  render() {
    const { activeFilters, activeSort, activeName, onClear, onClearAll } = this.props
    const hasFilters = activeFilters || activeSort || activeName ? true : false
    return (
      <div className="activeFilters">
        <Button bsStyle="link" onClick={hasFilters && onClearAll}>
          {hasFilters && <i className="fas fa-times list-remove right-space" />}
        </Button>
        <span className="filters-label">Filter / Sort:</span>
        {hasFilters ? (
          <>
            {map(
              activeFilters,
              (val, i) =>
                val && <Tag key={i} closable={true} onClose={() => onClear('activeFilters', i)}>{`${i}:${val}`}</Tag>
            )}
            {activeSort && (
              <Tag
                key={'sort'}
                closable={true}
                afterClose={() => onClear('activeSort', activeSort)}
              >{`sort:${activeSort}`}</Tag>
            )}
            {activeName && (
              <Tag key={'name'} closable={true} onClose={() => onClear('activeName')}>{`name:${activeName}`}</Tag>
            )}
          </>
        ) : null}
      </div>
    )
  }
}
