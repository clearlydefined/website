// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Checkbox, DropdownButton, MenuItem } from 'react-bootstrap'
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
    licenseToUpdate: '',
    releaseToUpdate: null,
    sourceToUpdate: null
  }

  onFieldChange = (field, value) => {
    const { onFieldChange } = this.props
    this.setState(prevState => {
      // toggle
      if (prevState.licenseToUpdate == value) {
        onFieldChange(field, null)
        return { licenseToUpdate: null }
      }
      onFieldChange(field, value)
      return { licenseToUpdate: value }
    })
  }

  renderLicensesDropdown() {
    const { licenseToUpdate } = this.state
    return (
      <SpdxPicker
        value={licenseToUpdate || ''}
        promptText={'License'}
        onChange={this.onFieldChange.bind(this, 'licensed.declared')}
      />
    )
  }

  renderSourcesButton() {
    const { sourceToUpdate } = this.state

    // trim starting from the slash (/) after "http://github.com"
    const source =
      Contribution.printCoordinates(sourceToUpdate) && Contribution.printCoordinates(sourceToUpdate).slice(18)
    return (
      <ModalEditor
        editor={SourcePicker}
        field="described.sourceLocation"
        onChange={this.onFieldChange.bind(this, 'described.sourceLocation')}
        revertable={false}
        showEditIcon={false}
      >
        <Button>
          <span>{source || 'Source'}</span>
          {sourceToUpdate && (
            <i
              className="fas fa-undo"
              onClick={e => {
                e.stopPropagation()
                this.onFieldChange('described.sourceLocation')
              }}
            />
          )}
        </Button>
      </ModalEditor>
    )
  }

  renderReleaseDateEditor() {
    const { releaseToUpdate } = this.state

    return (
      <InlineEditor
        editIcon={false}
        field="described.releaseDate"
        onChange={this.onFieldChange.bind(this, 'described.releaseDate')}
        placeholder="Release Date"
        revertable={false}
        type="date"
        value={Contribution.printDate(releaseToUpdate)}
      />
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

    const numSelected = Object.values(selected).filter(s => s).length
    const anySelections = Object.keys(selected).length > 0 && numSelected > 0

    return (
      <div className="section--filter-bar">
        <div className="pull-left">
          <Checkbox
            className="inlineBlock btn-group"
            disabled={hasComponents}
            onChange={onSelectAll}
            checked={anySelections}
          >
            Select All
          </Checkbox>
          {anySelections && <span className="selected">{numSelected} selected</span>}
          {anySelections && (
            <ButtonGroup className="inlineBlock">
              {this.renderLicensesDropdown()}
              {this.renderSourcesButton()}
              {this.renderReleaseDateEditor()}
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
