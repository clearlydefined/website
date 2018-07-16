// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, Table, InfiniteLoader, Column, SortIndicator, SortDirection } from 'react-virtualized'

export default class FileList extends React.Component {
  static propTypes = {
    definition: PropTypes.object.isRequired
  }

  _sort() {}

  _isSortEnabled() {
    return false
  }

  _noRowsRenderer() {
    return 'Nothing to see here'
  }

  render() {
    const { definition } = this.props
    const rowGetter = ({ index }) => definition.files[index]
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            ref="Table"
            disableHeader={false}
            height={400}
            noRowsRenderer={this._noRowsRenderer}
            overscanRowCount={3}
            rowHeight={40}
            rowGetter={rowGetter}
            rowCount={definition.files.length}
            sort={this._sort}
            width={width}
          >
            <Column dataKey="path" width={200} />
            <Column
              width={210}
              disableSort
              label="License"
              dataKey="license"
              cellRenderer={({ cellData }) => cellData}
              flexGrow={1}
            />
            <Column
              width={210}
              disableSort
              label="Attributions"
              dataKey="attributions"
              cellRenderer={({ cellData }) => cellData}
              flexGrow={1}
            />
            <Column
              width={210}
              disableSort
              label="Facets"
              dataKey="facets"
              cellRenderer={({ cellData }) => cellData}
              flexGrow={1}
            />
          </Table>
        )}
      </AutoSizer>
    )
  }
}
