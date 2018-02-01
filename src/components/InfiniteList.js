// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized'
import styles from 'react-virtualized/styles.css'
import { xor } from 'lodash'

export default class InfiniteList extends React.Component {

  static propTypes = {
    listHeight: PropTypes.number,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    totalRows: PropTypes.func,
    currentRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    loadMoreRows: PropTypes.func,
    rowRenderer: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    sortOrder: PropTypes.string,
    contentSeq: PropTypes.number,  // value upper levels can change to sign non-shallow content change
    expanded: PropTypes.arrayOf(PropTypes.number)
  }

  static defaultProps = {
    loadMoreRows: () => { }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(newProps) {
    const changed = xor(newProps.expanded, this.props.expanded)
    if (changed.length === 0 || !this.state.list)
      return
    this.state.list.recomputeRowHeights(changed.sort()[0])
  }

  // hook the List ref so we can trigger recompute when expand happens.
  hookRef(ref) {
    return (element, ...args) => {
      if (!element)
        return ref(element, ...args)
      if (this.state.list !== element)
        this.setState({ ...this.state, list: element })
    }
  }

  render() {
    const { isRowLoaded, loadMoreRows, listHeight, totalRows, currentRows, rowHeight, rowRenderer, noRowsRenderer, sortOrder, contentSeq } = this.props
    let height = Math.min(currentRows() * 150, listHeight || 300)
    if (noRowsRenderer)
      // show noRowsRenderer won't be called with zero height
      height = Math.max(height, 200)

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={totalRows()}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={this.hookRef(registerChild)}
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
