// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized'
import styles from 'react-virtualized/styles.css'

export default class InfiniteList extends React.Component {

  static propTypes = {
    listHeight: PropTypes.number,
    rowHeight: PropTypes.number,
    totalRows: PropTypes.func,
    currentRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    loadMoreRows: PropTypes.func,
    rowRenderer: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    sortOrder: PropTypes.string,
    contentSeq: PropTypes.number  // value upper levels can change to sign non-shallow content change
  }

  static defaultProps = {
    loadMoreRows: () => { }
  }

  render() {
    const { isRowLoaded, loadMoreRows, listHeight, totalRows, currentRows, rowHeight, rowRenderer, noRowsRenderer, sortOrder, contentSeq } = this.props
    let height = Math.min(currentRows() * rowHeight, listHeight || 300)
    if (noRowsRenderer)
      // show noRowsRenderer won't be called with zero height
      height = Math.max(height, rowHeight)

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={totalRows()}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={registerChild}
                className={styles.List}
                height={height}
                onRowsRendered={onRowsRendered}
                noRowsRenderer={noRowsRenderer}
                rowCount={currentRows()}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                width={width}
                sortOrder={sortOrder}
                contentSeq={contentSeq}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>)
  }
}
