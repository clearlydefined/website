// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { InfiniteList } from './'

export default class RowEntityList extends React.Component {
  static propTypes = {
    list: PropTypes.object.isRequired,
    listHeight: PropTypes.number,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    rowRenderer: PropTypes.func.isRequired,
    allowExpand: PropTypes.bool,
    loadMoreRows: PropTypes.func,
    fetchingRenderer: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    sortOrder: PropTypes.string,
    contentSeq: PropTypes.number // value upper levels can change to sign non-shallow content/display change
  }

  static defaultProps = {
    listHeight: 600,
    rowHeight: 50,
    fetchingRenderer: () => <div>Loading...</div>,
    noRowsRenderer: () => <div>Nothing found</div>
  }

  constructor(props) {
    super(props)
    this.state = { expanded: [] }
    this.isRowLoaded = this.isRowLoaded.bind(this)
    this.length = this.length.bind(this)
    this.listLength = this.listLength.bind(this)
    this.wrappedNoRowsRender = this.wrappedNoRowsRender.bind(this)
  }

  wrappedNoRowsRender() {
    const { noRowsRenderer, fetchingRenderer, list } = this.props
    const renderer = list.isFetching ? fetchingRenderer : noRowsRenderer
    return <div className={'list-noRows'}>{renderer()}</div>
  }

  render() {
    const { loadMoreRows, listHeight, list, rowRenderer, rowHeight, contentSeq, sortOrder } = this.props
    if (!list.list || list.list.length === 0) return this.wrappedNoRowsRender()
    return (
      <InfiniteList
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={loadMoreRows}
        listHeight={listHeight}
        totalRows={this.listLength}
        currentRows={this.length}
        rowRenderer={rowRenderer}
        noRowsRenderer={this.wrappedNoRowsRender}
        rowHeight={rowHeight}
        sortOrder={sortOrder}
        contentSeq={contentSeq}
      />
    )
  }

  listLength() {
    const { list } = this.props
    return list.headers ? list.headers.pagination.totalCount : 0
  }

  isRowLoaded({ index }) {
    return this.length() > index
  }

  length() {
    const { list } = this.props
    return list && list.list ? list.list.length : 0
  }
}
