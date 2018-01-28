// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { without } from 'lodash'
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
    contentSeq: PropTypes.number,  // value upper levels can change to sign non-shallow content change
  }

  static defaultProps = {
    listHeight: 600,
    rowHeight: 50,
    fetchingRenderer: () => <div>Loading...</div>,
    noRowsRenderer: () => <div>Nothing found</div>,
  }

  constructor(props) {
    super(props)
    this.state = { expanded: [] }
    this.isRowLoaded = this.isRowLoaded.bind(this)
    this.length = this.length.bind(this)
    this.listLength = this.listLength.bind(this)
    this.wrappedNoRowsRender = this.wrappedNoRowsRender.bind(this)
    this.wrappedRowRenderer = this.wrappedRowRenderer.bind(this)
    this.wrappedRowHeight = this.wrappedRowHeight.bind(this)
    this.toggleExpanded = this.toggleExpanded.bind(this)
  }

  wrappedNoRowsRender() {
    const { noRowsRenderer, fetchingRenderer, list } = this.props
    const renderer = list.isFetching ? fetchingRenderer : noRowsRenderer
    return <div className={"list-noRows"}>{renderer()}</div>
  }

  wrappedRowRenderer({ index, key, style }) {
    const { allowExpand, rowRenderer } = this.props
    return allowExpand
      ? rowRenderer({ index, key, style }, this.toggleExpanded, this.state.expanded.includes(index))
      : rowRenderer({ index, key, style })
  }

  wrappedRowHeight({ index }) {
    const { allowExpand, rowHeight } = this.props
    return allowExpand
      ? rowHeight({ index }, this.state.expanded.includes(index))
      : rowHeight({ index })
  }

  toggleExpanded(index) {
    const { expanded } = this.state
    if (expanded.includes(index))
      this.setState({ ...this.state, expanded: without(expanded, index) })
    else
      this.setState({ ...this.state, expanded: [...expanded, index] })
  }

  render() {
    const { loadMoreRows, listHeight, list, contentSeq, sortOrder, rowHeight } = this.props
    if (!list.list || list.list.length === 0)
      return this.wrappedNoRowsRender()
    return (
      <InfiniteList
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={loadMoreRows}
        listHeight={listHeight}
        totalRows={this.listLength}
        currentRows={this.length}
        rowRenderer={this.wrappedRowRenderer}
        noRowsRenderer={this.wrappedNoRowsRender}
        rowHeight={this.wrappedRowHeight}
        sortOrder={sortOrder}
        contentSeq={contentSeq}
        expanded={this.state.expanded}
      />)
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
