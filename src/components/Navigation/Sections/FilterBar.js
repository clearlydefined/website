// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Checkbox, DropdownButton, MenuItem } from 'react-bootstrap'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses as defaultLicenses, sources, releaseDates } from '../../../utils/utils'

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
    selected: PropTypes.object,
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

  state = {
    licenseToUpdate: ''
  }

  onChangeAllLicenses = ({ value }) => {
    this.setState(prevState => {
      // toggle
      if (prevState.licenseToUpdate == value) {
        this.props.onChangeAllLicenses(null)
        return { licenseToUpdate: null }
      }
      this.props.onChangeAllLicenses(value)
      return { licenseToUpdate: value }
    })
  }

  renderLicensesDropdown() {
    const { licenseToUpdate } = this.state
    const { customLicenses } = this.props
    const licenses = customLicenses || defaultLicenses
    return (
      <DropdownButton
        className="list-button"
        bsStyle="default"
        title={licenseToUpdate || 'License'}
        id="multi-license-select"
      >
        {licenses.map((license, index) => (
          <MenuItem key={index} onSelect={this.onChangeAllLicenses} eventKey={{ value: license.value }}>
            <span>{license.label}</span>
            {licenseToUpdate === license.value && <i className="fas fa-check" />}
          </MenuItem>
        ))}
      </DropdownButton>
    )
  }

  render() {
    const {
      activeSort,
      activeFilters,
      onFilter,
      onSort,
      hasComponents,
      selected,
      showSortFilter,
      showLicenseFilter,
      showReleaseDateFilter,
      showSourceFilter,
      customLicenses,
      customSorts,
      customSources,
      customReleaseDates,
      onSelectAll
    } = this.props

    const anySelections = Object.keys(selected).length > 0 && Object.values(selected).filter(s => s).length > 0

    return (
      <div className="section--filter-bar">
        <div className="pull-left">
          <Checkbox className="inlineBlock" disabled={hasComponents} onChange={onSelectAll} checked={anySelections}>
            Select All
          </Checkbox>
          {anySelections && (
            <ButtonGroup className="inlineBlock">
              {this.renderLicensesDropdown()}
              <Button>Source</Button>
              <Button>Release Date</Button>
            </ButtonGroup>
          )}
        </div>
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
            <FilterList
              list={customLicenses || defaultLicenses}
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
        </div>
      </div>
    )
  }
}
