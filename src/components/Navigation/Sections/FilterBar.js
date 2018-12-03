import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses, sources, releaseDates } from '../../../utils/utils'

export default class FilterBar extends Component {
  static propTypes = {
    activeSort: PropTypes.string,
    activeFilters: PropTypes.object,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    hasComponents: PropTypes.bool
  }

  render() {
    const { activeSort, activeFilters, onFilter, onSort, hasComponents } = this.props
    return (
      <div className="list-filter" align="right">
        <SortList
          list={sorts}
          title={'Sort By'}
          id={'sort'}
          disabled={hasComponents}
          value={activeSort}
          onSort={onSort}
        />
        <FilterList
          list={licenses}
          title={'License'}
          id={'licensed.declared'}
          disabled={hasComponents}
          value={activeFilters}
          onFilter={onFilter}
        />
        <FilterList
          list={sources}
          title={'Source'}
          id={'described.sourceLocation'}
          disabled={hasComponents}
          value={activeFilters}
          onFilter={onFilter}
        />
        <FilterList
          list={releaseDates}
          title={'Release Date'}
          id={'described.releaseDate'}
          disabled={hasComponents}
          value={activeFilters}
          onFilter={onFilter}
        />
      </div>
    )
  }
}
