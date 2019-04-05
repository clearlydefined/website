// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Checkbox } from 'react-bootstrap'
import SortList from '../Ui/SortList'
import FilterList from '../Ui/FilterList'
import { sorts, licenses as defaultLicenses, sources, releaseDates } from '../../../utils/utils'
import { ModalEditor, SourcePicker, InlineEditor } from '../..'
import SpdxPicker from '../../SpdxPicker'
import Contribution from '../../../utils/contribution'

export default class FilterBar extends Component {
  static propTypes = {
    activeSort: PropTypes.string,
    activeFilters: PropTypes.object,
    multiSelectEnabled: PropTypes.bool,
    onFieldChange: PropTypes.func,
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

  state = {
    'licensed.declared': null,
    release: null,
    source: null
  }

  onFieldChange = (field, value) => {
    const { onFieldChange } = this.props
    this.setState(prevState => {
      // toggle
      if (prevState[field] === value) {
        onFieldChange && onFieldChange(field, null)
        return { [field]: null }
      }
      onFieldChange && onFieldChange(field, value)
      return { [field]: value }
    })
  }

  renderLicensesDropdown() {
    return (
      <SpdxPicker value={''} promptText={'License'} onChange={this.onFieldChange.bind(this, 'licensed.declared')} />
    )
  }

  renderSourcesButton() {
    const sourceToUpdate = this.state['described.sourceLocation']

    const coordinates = Contribution.printCoordinates(sourceToUpdate)
    // trim starting from the slash (/) after "http://github.com"
    let source = coordinates && coordinates.slice(18)

    if (source && source.indexOf('commit/') > -1) {
      source = source.slice(0, source.indexOf('commit/') + 7 + 7) // 7 = length of "commit/" - 7 = length of the hash
    }

    return (
      <ModalEditor
        editor={SourcePicker}
        field="described.sourceLocation"
        onChange={this.onFieldChange.bind(this, 'described.sourceLocation')}
        onRevert={this.onFieldChange.bind(this, 'described.sourceLocation')}
        revertable
        showEditIcon
        value={source}
        initialValue={null}
        placeholder="Source location"
      />
    )
  }

  renderReleaseDateEditor() {
    return (
      <InlineEditor
        field="described.releaseDate"
        onChange={this.onFieldChange.bind(this, 'described.releaseDate')}
        onRevert={this.onFieldChange.bind(this, 'described.releaseDate')}
        placeholder="Release Date"
        revertable
        editIcon
        type="date"
        value={Contribution.printDate(this.state['described.releaseDate'])}
        initialValue={null}
      />
    )
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
          <ButtonGroup className="list-singleLine inlineBlock">
            {this.renderSourcesButton()}
            {this.renderReleaseDateEditor()}
            {this.renderLicensesDropdown()}
          </ButtonGroup>
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
      customLicenses,
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
