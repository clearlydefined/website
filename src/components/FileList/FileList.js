// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import ReactTable from "react-table";
import Modal from 'react-modal';
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
      showPopup: false,
      expanded: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    //Data are parsed to create a tree-folder structure
    nextProps.files && this.setState({ files: parsePaths(nextProps.files) })
  }

  showPopup = (value) => {
    this.setState({ showPopup: true })
  }

  handleRowExpanded(newExpanded, index, event) {
    this.setState({
      // we override newExpanded, keeping only current selected row expanded
      expanded: { [index]: true }
    });
  }

  render() {
    const { files, showPopup } = this.state;
    console.log(showPopup)
    return <div>

      <Modal
        ariaHideApp={false}
        isOpen={showPopup}
        onRequestClose={() => this.setState({ showPopup: false })}
        contentLabel="Example Modal"
      >
        <div>I am a modal</div>

      </Modal>
      <TreeTable
        showPagination={false}
        collapseOnSortingChange={false}
        filterable={false}
        freezeWhenExpanded={true}
        //expanded={this.state.expanded}
        //onExpandedChange={(newExpanded, index, event) => this.handleRowExpanded(newExpanded, index, event)}
        defaultFilterMethod={(filter, row, column) => {
          const id = filter.pivotId || filter.id;
          return row[id] !== undefined
            ? String(row[id])
              .toLowerCase()
              .includes(filter.value.toLowerCase())
            : true;
        }}
        noDataText="There are currently no files for this definition"
        data={files}
        pivotBy={pathColums}
        columns={columns.concat([{
          Header: "Name",
          accessor: "name",
          style: {},
          Cell: (row) => <div style={{ paddingLeft: `${10 * (row.level - 1)}px` }}>{row.value}</div>
        }, {
          Header: "Facets",
          accessor: "facets",
          Cell: (row) => <FacetsRenderer item={row} />
        }, {
          Header: "Licenses",
          id: "license",
          accessor: "license",
          Cell: (row) => <LicensesRenderer item={row} />
        },
        {
          Header: "Copyrights",
          accessor: "attributions",
          Cell: (row) => <CopyrightsRenderer item={row} showPopup={this.showPopup} />
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