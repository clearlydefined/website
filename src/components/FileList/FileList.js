// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import treeTableHOC from './treeTable'
import FilterCustomComponent from './FilterCustomComponent'
import FacetsRenderer from '../FacetsRenderer'
import LicensesRenderer from '../LicensesRenderer'
import CopyrightsRenderer from '../CopyrightsRenderer'
import Contribution from '../../utils/contribution'
import FileListSpec from '../../utils/filelist'

/**
 * A File List Tree-view, according to https://github.com/clearlydefined/website/issues/191
 *
 */
export default class FileList extends Component {
  static propTypes = {
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    readOnly: false
  }

  state = {
    files: [],
    expanded: {},
    isFiltering: false
  }

  componentDidMount() {
    // Data are parsed to create a tree-folder structure
    const { files, component, previewDefinition } = this.props
    if (files) {
      const definitionFiles = parsePaths(files, component.item, previewDefinition)
      files && this.setState({ files: definitionFiles, rawData: definitionFiles }, () => this.forceUpdate())
    }
  }
  componentWillReceiveProps(nextProps) {
    // Data are parsed to create a tree-folder structure
    const { files, component, previewDefinition } = nextProps
    if (files) {
      const definitionFiles = parsePaths(files, component.item, previewDefinition)
      files && this.setState({ files: definitionFiles, rawData: definitionFiles }, () => this.forceUpdate())
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.files.length !== this.state.files.length || !isEqual(nextProps.changes, this.props.changes)
  }

  generateColumns = columns => {
    const { component, previewDefinition, readOnly } = this.props
    return columns.concat([
      {
        Header: 'Name',
        accessor: 'name',
        resizable: false,
        style: {},
        Cell: row => <div style={{ paddingLeft: `${10 * (row.level - 1)}px` }}>{row.value}</div>,
        filterMethod: (filter, rows) =>
          rows.filter(
            item =>
              item._original ? item._original.path.toLowerCase().includes(filter.value.filterValue.toLowerCase()) : true
          ),
        filterAll: true
      },
      {
        Header: 'Facets',
        accessor: 'facets',
        resizable: false,
        Cell: row => <FacetsRenderer item={row} />,
        filterMethod: (filter, rows) => {
          const filterValue = filter.value.filterValue.toLowerCase()
          return rows.filter(item => {
            if (item && item.facets && item.facets.length) {
              return item.facets.findIndex(f => f.value.includes(filterValue)) > -1
            }
            return true
          })
        },
        filterAll: true
      },
      {
        Header: 'Licenses',
        id: 'license',
        accessor: 'license',
        resizable: false,
        Cell: row =>
          row.original && (
            <LicensesRenderer
              readOnly={readOnly}
              isDifferent={Contribution.ifDifferent(
                component,
                previewDefinition,
                `files[${row.original.id}].license`,
                true,
                false
              )}
              value={Contribution.getValue(component.item, previewDefinition, `files[${row.original.id}].license`)}
              onSave={license => {
                this.props.onChange(`files[${row.original.id}]`, license, null, license => {
                  const attributions = Contribution.getValue(
                    component.item,
                    previewDefinition,
                    `files[${row.original.id}].attributions`
                  )
                  return {
                    path: row.original.path,
                    license,
                    ...(attributions ? { attributions } : {})
                  }
                })
              }}
            />
          ),
        filterMethod: (filter, rows) =>
          filter.value.filterValue
            ? rows.filter(
                item =>
                  item._original
                    ? item._original.license
                      ? item._original.license
                          .toString()
                          .toLowerCase()
                          .includes(filter.value.filterValue.toLowerCase())
                      : false
                    : true
              )
            : rows,
        filterAll: true
      },
      {
        Header: 'Copyrights',
        accessor: 'attributions',
        resizable: false,
        Cell: row => (
          <CopyrightsRenderer
            item={row}
            readOnly={readOnly}
            showPopup={this.showPopup}
            onSave={value => {
              this.props.onChange(`files[${row.original.id}]`, value, null, value => {
                return {
                  path: row.original.path,
                  license: Contribution.getValue(
                    component.item,
                    previewDefinition,
                    `files[${row.original.id}].license`
                  ),
                  attributions: value
                }
              })
            }}
          />
        ),
        filterMethod: (filter, rows) => {
          if (!filter.value.filterValue) return rows
          const filterValue = filter.value.filterValue.toLowerCase()
          return rows.filter(item => {
            if (!item._original) return true
            if (!item._original.attributions) return false
            return (
              item._original.attributions.findIndex(a =>
                a.value
                  .toString()
                  .toLowerCase()
                  .includes(filterValue)
              ) > -1
            )
          })
        },
        filterAll: true
      }
    ])
  }

  render() {
    const { files, isFiltering } = this.state

    return (
      <div>
        <TreeTable
          showPagination={false}
          sortable={false}
          filterable
          freezeWhenExpanded={false}
          manual={false}
          onFilteredChange={() => this.setState({ isFiltering: true })}
          noDataText={
            isFiltering ? "Current filters didn't match any data" : 'There are currently no files for this definition'
          }
          data={files}
          pivotBy={pathColums}
          columns={this.generateColumns(columns)} // Merge columns array with other columns to show after the folders
          FilterComponent={props => {
            return (
              !String(props.column.id)
                .toLowerCase()
                .includes('folder_') && <FilterCustomComponent {...props} />
            )
          }}
        />
      </div>
    )
  }
}

// Import Custom TreeTable HOC
const TreeTable = treeTableHOC(ReactTable)

const pathColums = []
const columns = []

/**
 * Parse each file's path to retrieve the complete folder structure
 * @param  {} files The files object coming from the definition
 * @return {Object} Return a new object containing the files object modified
 */
const parsePaths = (files, component, preview) => {
  return transform(files, (result, file, key) => {
    file.id = key
    const folders = file.path.split('/')
    file.facets = FileListSpec.getFileFacets(file.facets, component, preview, key)
    file.attributions = FileListSpec.getFileAttributions(file.attributions, component, preview, key)

    // If files are in the root folder, then they will grouped into a "/" folder
    if (folders.length === 1) {
      file['folder_0'] = '/'
    } else {
      folders.unshift('/')
    }

    // Add file[`folder_${index}`] to file object
    // If index is the last file, then is the name of the file
    folders.forEach((p, index) => {
      if (index + 1 === folders.length) file.name = p
      else {
        file[`folder_${index}`] = p
      }
    })

    folders.forEach((p, index) => {
      if (index + 1 < folders.length && pathColums.indexOf(`folder_${index}`) === -1) {
        // Add folders_${index} to patchColumns array
        pathColums.push(`folder_${index}`)

        // Add folders_${index} to columns array
        columns.push({
          accessor: `folder_${index}`,
          show: false,
          aggregated: true,
          resizable: false
        })
      }
    })
    result[key] = file
  })
}
