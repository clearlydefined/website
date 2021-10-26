// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized'
import { noRowsHeight } from '../utils/utils'

export default class InfiniteList extends React.Component {
  static propTypes = {
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    totalRows: PropTypes.func,
    currentRows: PropTypes.func,
    isRowLoaded: PropTypes.func,
    loadMoreRows: PropTypes.func,
    rowRenderer: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    sortOrder: PropTypes.string,
    contentSeq: PropTypes.number // value upper levels can change to signal non-shallow content change
  }

  static defaultProps = {
    loadMoreRows: () => { }
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(newProps) {
    // aggressively recompute heights if the deeper content has changes. Never know if heights will be affected.
    const changed = newProps.contentSeq !== this.props.contentSeq
    if (!changed || !this.state.list) return
    this.state.list.recomputeRowHeights(0)
  }

  // hook the List ref so we can trigger recompute when expand happens.
  hookRef(ref) {
    return (element, ...args) => {
      if (!element) return ref(element, ...args)
      if (this.state.list !== element) this.setState({ ...this.state, list: element })
    }
  }

  render() {
    const { isRowLoaded, loadMoreRows, sortOrder, contentSeq, customClassName, threshold } = this.props
    const { totalRows, currentRows, rowHeight, rowRenderer, noRowsRenderer } = this.props

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={totalRows()}
        threshold={threshold}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={this.hookRef(registerChild)}
                className={`${customClassName}`}
                height={totalRows() === 0 ? noRowsHeight : height}
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
      </InfiniteLoader>
    )
  }
}
