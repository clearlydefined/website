import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses, sources, releaseDates, curateFilters } from '../../../utils/utils'

export default class FilterBar extends Component {
  static propTypes = {
    activeSort: PropTypes.string,
    activeFilters: PropTypes.object,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    hasComponents: PropTypes.bool,
    showSortFilter: PropTypes.bool,
    showLicenseFilter: PropTypes.bool,
    showSourceFilter: PropTypes.bool,
    showReleaseDateFilter: PropTypes.bool,
    showCurateFilter: PropTypes.bool,
    customLicenses: PropTypes.array,
    customSorts: PropTypes.array,
    customSources: PropTypes.array,
    customReleaseDates: PropTypes.array
  }

  static defaultProps = {
    showSortFilter: true,
    showLicenseFilter: true,
    showSourceFilter: true,
    showReleaseDateFilter: true,
    showCurateFilter: false
  }

  render() {
    const {
      activeSort,
      activeFilters,
      onFilter,
      onSort,
      hasComponents,
      showSortFilter,
      showLicenseFilter,
      showReleaseDateFilter,
      showSourceFilter,
      showCurateFilter,
      customLicenses,
      customSorts,
      customSources,
      customReleaseDates,
      customCurateFilters
    } = this.props

    return (
      <div className="list-filter" align="right">
        {showSortFilter && (
          <SortList
            list={customSorts || sorts}
            title={'Sort By'}
            id={'sort'}
            disabled={hasComponents}
            value={activeSort}
            onSort={onSort}
          />
        )}
        {showLicenseFilter && (
          <FilterList
            list={customLicenses || licenses}
            title={'License'}
            id={'licensed.declared'}
            disabled={hasComponents}
            value={activeFilters}
            onFilter={onFilter}
          />
        )}
        {showSourceFilter && (
          <FilterList
            list={customSources || sources}
            title={'Source'}
            id={'described.sourceLocation'}
            disabled={hasComponents}
            value={activeFilters}
            onFilter={onFilter}
          />
        )}
        {showReleaseDateFilter && (
          <FilterList
            list={customReleaseDates || releaseDates}
            title={'Release Date'}
            id={'described.releaseDate'}
            disabled={hasComponents}
            value={activeFilters}
            onFilter={onFilter}
          />
        )}
        {showCurateFilter && (
          <FilterList
            list={customCurateFilters || curateFilters}
            title={'Curate'}
            id={'curate'}
            disabled={hasComponents}
            value={activeFilters}
            onFilter={onFilter}
          />
        )}
      </div>
    )
  }
}
