// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types'
import { Button, ButtonGroup, ButtonToolbar, Alert } from 'react-bootstrap'
import { RowEntityList, TwoLineEntry } from './'

export default class HarvestQueueList extends React.Component {

  static propTypes = {
    list: PropTypes.object.isRequired,
    listHeight: PropTypes.number,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    fetchingRenderer: PropTypes.func,
  }

  static defaultProps = {
    loadMoreRows: () => { },
  }

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.renderButtons = props.renderButtons || this.renderButtons.bind(this)
  }

  removeRequest(request, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(request)
  }

  renderButtons(request) {
    return (
      <ButtonToolbar className="list-buttons">
        <ButtonGroup>
          <Button bsStyle="warning" onClick={this.removeRequest.bind(this, request)}>Remove</Button>
        </ButtonGroup>
      </ButtonToolbar>
    )
  }

  renderHeadline(request) {
    const { type, namespace, name } = request
    const namespaceText = (namespace + '/') || ''
    return (<span>{namespaceText}{name} {type}</span>)
  }

  renderMessage(request) {
    const { type, policy } = request
    const nameText = type ? <span>{type}&nbsp;</span> : ''
    const policyText = 'Policy: ' + policy ? policy : 'default'
    return (<span>{nameText} &nbsp; {policyText}</span>)
  }

  getImage(type) {
    return null
  }

  renderRow({ index, key, style }) {
    const { list, history } = this.props
    const request = list.list[index]
    const type = request.type
    const clickHandler = () => { }
    return (
      <div key={key} style={style}>
        <TwoLineEntry
          image={this.getImage(type)}
          headline={this.renderHeadline(request)}
          message={this.renderMessage(request)}
          buttons={this.renderButtons(request)}
          onClick={clickHandler}
        />
      </div>)
  }

  render() {
    const { loadMoreRows, listHeight, noRowsRenderer, list, fetchingRenderer } = this.props
    return (<RowEntityList
      list={list}
      loadMoreRows={loadMoreRows}
      listHeight={listHeight}
      rowRenderer={this.renderRow}
      rowHeight={50}
      noRowsRenderer={noRowsRenderer}
      fetchingRenderer={fetchingRenderer}
    />)
  }
}
