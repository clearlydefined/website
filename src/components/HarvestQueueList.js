// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types'
import { RowEntityList, TwoLineEntry, GitHubCommitPicker, NpmVersionPicker } from './'
import { clone } from 'lodash'
import FontAwesome from 'react-fontawesome'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'

export default class HarvestQueueList extends React.Component {

  static propTypes = {
    list: PropTypes.object.isRequired,
    listHeight: PropTypes.number,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    fetchingRenderer: PropTypes.func,
  }

  static defaultProps = {
    loadMoreRows: () => { },
  }

  constructor(props) {
    super(props)
    this.state = { contentSeq: 0, sortOrder: null }
    this.renderRow = this.renderRow.bind(this)
    this.renderButtons = props.renderButtons || this.renderButtons.bind(this)
    this.commitChanged = this.commitChanged.bind(this)
  }

  removeRequest(request, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(request)
  }

  commitChanged(request, value) {
    const newRequest = clone(request)
    newRequest.revision = value ? value.sha : null
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
    this.props.onChange(request, newRequest)
  }

  npmVersionChanged(request, value) {
    const newRequest = clone(request)
    newRequest.revision = value 
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
    this.props.onChange(request, newRequest)
  }

  renderButtons(request) {
    return (
      <div className='list-activity-area'>
        {request.provider === 'github' && <GitHubCommitPicker
          request={request}
          onChange={this.commitChanged.bind(this, request)}
        />}
        {request.provider === 'npmjs' && <NpmVersionPicker
          request={request}
          onChange={this.npmVersionChanged.bind(this, request)}
        />}
        <FontAwesome name={'times'} className='list-remove' onClick={this.removeRequest.bind(this, request)} />
      </div>)
  }

  renderHeadline(request) {
    const { namespace, name } = request
    const namespaceText = namespace ? (namespace + '/') : ''
    return (<span>{namespaceText}{name}</span>)
  }

  renderMessage(request) {
    const { type, policy } = request
    const nameText = type ? <span>{type}&nbsp;</span> : ''
    const policyText = 'Policy: ' + policy ? policy : 'default'
    return (<span>{nameText} &nbsp; {policyText}</span>)
  }

  getImage(request) {
    if (request.provider === 'github')
      return github
    if (request.provider === 'npmjs')
      return npm
    return null
  }

  renderRow({ index, key, style }) {
    const { list } = this.props
    const request = list.list[index]
    const clickHandler = () => { }
    return (
      <div key={key} style={style}>
        <TwoLineEntry
          image={this.getImage(request)}
          headline={this.renderHeadline(request)}
          message={this.renderMessage(request)}
          buttons={this.renderButtons(request)}
          onClick={clickHandler}
        />
      </div>)
  }

  render() {
    const { loadMoreRows, listHeight, noRowsRenderer, list, fetchingRenderer } = this.props
    const { sortOrder, contentSeq } = this.state
    return (<RowEntityList
      list={list}
      loadMoreRows={loadMoreRows}
      listHeight={listHeight}
      rowRenderer={this.renderRow}
      rowHeight={50}
      noRowsRenderer={noRowsRenderer}
      fetchingRenderer={fetchingRenderer}
      sortOrder={sortOrder}
      contentSeq={contentSeq}
    />)
  }
}
