import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses, sources, releaseDates } from '../../../utils/utils'

export default class FilterBar extends Component {
  static propTypes = {
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    hasComponents: PropTypes.bool,
    showSortFilter: PropTypes.bool,
    showLicenseFilter: PropTypes.bool,
    showSourceFilter: PropTypes.bool,
    showReleaseDateFilter: PropTypes.bool,
    customLicenses: PropTypes.array,
    customSorts: PropTypes.array,
    customSources: PropTypes.array,
    customReleaseDates: PropTypes.array
  }

  static defaultProps = {
    showSortFilter: true,
    showLicenseFilter: true,
    showSourceFilter: true,
    showReleaseDateFilter: true
  }

  render() {
    const {
      onFilter,
      onSort,
      hasComponents,
      showSortFilter,
      showLicenseFilter,
      showReleaseDateFilter,
      showSourceFilter,
      customLicenses,
      customSorts,
      customSources,
      customReleaseDates
    } = this.props

    return (
      <div className="list-filter" align="right">
        {showSortFilter && (
          <SortList
            list={customSorts || sorts}
            title={'Sort By'}
            id={'sort'}
            disabled={hasComponents}
            onSort={onSort}
            width={130}
          />
        )}
        {showLicenseFilter && (
          <FilterList
            list={customLicenses || licenses}
            title={'License'}
            id={'licensed.declared'}
            disabled={hasComponents}
            onFilter={onFilter}
            width={140}
          />
        )}
        {showSourceFilter && (
          <FilterList
            list={customSources || sources}
            title={'Source'}
            id={'described.sourceLocation'}
            disabled={hasComponents}
            onFilter={onFilter}
          />
        )}
        {showReleaseDateFilter && (
          <FilterList
            list={customReleaseDates || releaseDates}
            title={'Release Date'}
            id={'described.releaseDate'}
            disabled={hasComponents}
            onFilter={onFilter}
            width={125}
          />
        )}
      </div>
    )
  }
}
