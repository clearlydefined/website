// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'react-bootstrap'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, sources, releaseDates, changes } from '../../../utils/utils'
import SpdxPicker from '../../SpdxPicker'
import ButtonWithTooltip from '../Ui/ButtonWithTooltip'

export default class FilterBar extends Component {
  static propTypes = {
    activeSort: PropTypes.string,
    activeFilters: PropTypes.object,
    multiSelectEnabled: PropTypes.bool,
    onFilter: PropTypes.func,
    onSort: PropTypes.func,
    hasComponents: PropTypes.bool,
    showSortFilter: PropTypes.bool,
    showLicenseFilter: PropTypes.bool,
    showSourceFilter: PropTypes.bool,
    showReleaseDateFilter: PropTypes.bool,
    selected: PropTypes.object,
    customLicenses: PropTypes.array,
    customSorts: PropTypes.array,
    customSources: PropTypes.array,
    customReleaseDates: PropTypes.array
  }

  static defaultProps = {
    multiSelectEnabled: false,
    showSortFilter: true,
    showLicenseFilter: true,
    showSourceFilter: true,
    showReleaseDateFilter: true
  }

  renderMultiSelect() {
    const { hasComponents, onSelectAll, selected, components } = this.props

    const numSelected = Object.values(selected).filter(s => s).length
    const anySelections = Object.keys(selected).length > 0 && numSelected > 0
    return (
      <div className="pull-left selected-definitions">
        <Checkbox
          data-test-id="select-all-checkbox"
          className="inlineBlock btn-group"
          disabled={hasComponents}
          onChange={onSelectAll}
          checked={anySelections}
        />
        {anySelections && <span>{numSelected} of</span>}
        <span>{components.length} definitions</span>
        {anySelections && (
          <ButtonWithTooltip tip={'Edit one definition and apply a change to all selected'}>
            <i className="fas fa-info-circle" />
          </ButtonWithTooltip>
        )}
      </div>
    )
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
      customSorts,
      customSources,
      customReleaseDates,
      multiSelectEnabled
    } = this.props

    return (
      <div className="section--filter-bar">
        {multiSelectEnabled && this.renderMultiSelect()}
        <div className="list-filter pull-right">
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
            <SpdxPicker
              value={''}
              disabled={hasComponents}
              promptText={'License'}
              onChange={value => onFilter({ type: 'licensed.declared', value })}
              customIdentifiers={['NOASSERTION', 'PRESENCE OF', 'ABSENCE OF', '']}
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
          {showReleaseDateFilter && (
            <FilterList
              list={changes}
              title={'Changes'}
              id={'changes'}
              disabled={hasComponents}
              value={activeFilters}
              onFilter={onFilter}
            />
          )}
        </div>
      </div>
    )
  }
}
