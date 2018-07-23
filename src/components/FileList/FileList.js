// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import treeTableHOC from "./treeTable";
import FilterCustomComponent from './FilterCustomComponent'
import FacetsRenderer from './FacetsRenderer';
import LicensesRenderer from './LicensesRenderer';
import CopyrightsRenderer from './CopyrightsRenderer';

/**
 * A File List Tree-view, according to https://github.com/clearlydefined/website/issues/191
 * 
 */
export default class FileList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      expanded: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.files && this.state.files || prevState.files.length != this.state.files.length) {
      //this.forceUpdate()
    }
  }

  componentWillReceiveProps(nextProps) {
    //Data are parsed to create a tree-folder structure
    if (nextProps.files) {
      const files = parsePaths(nextProps.files);
      nextProps.files && this.setState({ files, rawData: files })
    }
  }

  /**
   * Custom Function to sort data
   * It would be called on each onSortedChange event of the Table
   * For 'name' column, compares the whole path of the file
   * For other columns, compares string values
   * Arrays are converted to a string
   * 
   */
  sortData = (sort) => {
    const sortedData = this.state.files.sort((a, b) => {
      if (sort[0].id === "name") {
        a = a.path.toLowerCase();
        b = b.path.toLowerCase();
      } else {
        a = a[sort[0].id] ? a[sort[0].id].toString().toLowerCase() : ''
        b = b[sort[0].id] ? b[sort[0].id].toString().toLowerCase() : ''
      }
      if (a < b) {
        return sort[0].desc ? 1 : -1;
      }
      if (a > b) {
        return sort[0].desc ? -1 : 1;
      }
      return 0;
    })
    this.setState({ files: sortedData })
  }

  filterData = (filters) => {
    if (this.state.rawData) {
      const filteredData = this.state.rawData.filter((item) =>
        filters.every((filter) => {
          if (filter.id === "name") {
            return item.path.toLowerCase().includes(filter.value.filterValue.toLowerCase())
          } else {
            const a = item[filter.id] ? item[filter.id].toString().toLowerCase() : ''
            return a.includes(filter.value.filterValue.toLowerCase())
          }
        })
      )
      //this.setState({ files: filteredData })
    }
  }

  render() {
    const { files } = this.state;

    return <div>
      <TreeTable
        showPagination={false}
        collapseOnSortingChange={false}
        filterable={true}
        freezeWhenExpanded={false}
        manual={false}
        //expanded={this.state.expanded}
        noDataText="There are currently no files for this definition"
        onSortedChange={(newSorted) => this.sortData(newSorted)}
        onExpandedChange={(newExpanded, index) => console.log(newExpanded, index)}
        data={files}
        pivotBy={pathColums}
        columns={columns.concat([{
          Header: "Name",
          accessor: "name",
          style: {},
          Cell: (row) => <div style={{ paddingLeft: `${10 * (row.level - 1)}px` }}>{row.value}</div>,
          filterMethod: (filter, rows) => rows.filter(item => item._original ? item._original.path.toLowerCase().includes(filter.value.filterValue.toLowerCase()) : true),
          filterAll: true
        }, {
          Header: "Facets",
          accessor: "facets",
          Cell: (row) => <FacetsRenderer item={row} />,
          filterMethod: (filter, rows) => rows.filter(item => item._original && item._original.facets ? item._original.facets.toString().toLowerCase().includes(filter.value.filterValue.toLowerCase()) : true),
          filterAll: true
        }, {
          Header: "Licenses",
          id: "license",
          accessor: "license",
          Cell: (row) => <LicensesRenderer item={row} />,
          filterMethod: (filter, rows) => rows.filter(item => item._original ? item._original.license && item._original.license.toLowerCase().includes(filter.value.filterValue.toLowerCase()) : true),
          filterAll: true
        },
        {
          Header: "Copyrights",
          accessor: "attributions",
          Cell: (row) => <CopyrightsRenderer item={row} showPopup={this.showPopup} />,
          filterMethod: (filter, rows) => {
            if (filter.value.filterValue) {
              const res = rows.filter(item => {
                if (item._original) {
                  if (item._original.attributions) {
                    return item._original.attributions.toString().toLowerCase().includes(filter.value.filterValue.toLowerCase())
                  } else {
                    return false;
                  }
                } else {
                  return true;
                }

              })
              return res;
            }
            else return rows
          },
          filterAll: true
        }
        ])
        }  //Merge columns array with other columns to show after the folders
        FilterComponent={(props) => {
          return !String(props.column.id)
            .toLowerCase()
            .includes('folder_') && <FilterCustomComponent {...props} />
        }}
      />
    </div>
  }
}

// Import Custom TreeTable HOC
const TreeTable = treeTableHOC(ReactTable);

const pathColums = [];
const columns = [];

// Parse Path to retrieve the complete folder structure
const parsePaths = (data) => {
  const res = data.map(item => {
    const folders = item.path.split("/");

    //If files are in the root folder, then they will grouped into a "/" folder
    if (folders.length === 1) {
      item['folder_0'] = '/';
    } else {
      folders.unshift("/")
    }

    //Add item[`folder_${index}`] to item object
    //If index is the last item, then is the name of the file
    folders.map((p, index) => { if (index + 1 === folders.length) item.name = p; else { item[`folder_${index}`] = p; } })

    folders.map((p, index) => {
      if (index + 1 < folders.length && pathColums.indexOf(`folder_${index}`) === -1) {

        //Add folders_${index} to patchColumns array      
        pathColums.push(`folder_${index}`);

        //Add folders_${index} to columns array
        columns.push({
          accessor: `folder_${index}`,
          show: false,
          aggregated: true
        })
      }
    })
    return item;
  })
  return res;
}