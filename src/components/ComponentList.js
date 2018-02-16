// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { RowEntityList, TwoLineEntry, GitHubCommitPicker, NpmVersionPicker } from './'
import { Row, Col } from 'react-bootstrap'
import { clone, get } from 'lodash'
import FontAwesome from 'react-fontawesome'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'

export default class ComponentList extends React.Component {

  static propTypes = {
    list: PropTypes.object.isRequired,
    listHeight: PropTypes.number,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    fetchingRenderer: PropTypes.func,
    definitions: PropTypes.object,
    githubToken: PropTypes.string
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
    this.rowHeight = this.rowHeight.bind(this)
  }

  removeComponent(component, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(component)
  }

  commitChanged(component, value) {
    const newComponent = clone(component)
    newComponent.revision = value ? value.sha : null
    this.incrementSequence()
    const { onChange } = this.props
    onChange && onChange(component, newComponent)
  }

  npmVersionChanged(component, value) {
    const newComponent = clone(component)
    newComponent.revision = value
    this.incrementSequence()
    const { onChange } = this.props
    onChange && onChange(component, newComponent)
  }

  incrementSequence() {
    this.setState({ ...this.state, contentSeq: this.state.contentSeq + 1 })
  }

  renderButtons(component) {
    return (
      <div className='list-activity-area'>
        {component.provider === 'github' && <GitHubCommitPicker
          request={component}
          defaultInputValue={component.revision}
          token={this.props.githubToken}
          onChange={this.commitChanged.bind(this, component)}
        />}
        {component.provider === 'npmjs' && <NpmVersionPicker
          request={component}
          defaultInputValue={component.revision}
          onChange={this.npmVersionChanged.bind(this, component)}
        />}
        <FontAwesome name={'times'} className='list-remove' onClick={this.removeComponent.bind(this, component)} />
      </div>)
  }

  renderHeadline(component) {
    const { namespace, name } = component
    const namespaceText = namespace ? (namespace + '/') : ''
    return (<span>{namespaceText}{name}</span>)
  }

  renderMessage(component) {
    const { type, policy } = component
    const nameText = type ? <span>{type}&nbsp;</span> : ''
    const policyText = 'Policy: ' + policy ? policy : 'default'
    return (<span>{nameText} &nbsp; {policyText}</span>)
  }

  getSourceUrl(definition) {
    const l = definition.described && definition.described.sourceLocation
    if (l)
      switch (l.provider) {
        case 'github':
          return <Link to={`https://github.com/${l.namespace}/${l.name}/commit/${l.revision}`}>{l.revision}</Link>
        default:
          return ''
      }
    const p = definition.package || {}
    switch (p.provider) {
      case 'github':
        return <Link to={`https://github.com/${p.namespace}/${p.name}/commit/${p.revision}`}>{p.revision}</Link>
      default:
        return ''
    }
  }

  renderPanel(component) {
    const { definitions } = this.props
    const key = component.toPath()
    const definition = definitions[key]
    if (!definition)
      return (<div className={"list-noRows"}>
        <div>
          'Boo, nothing to see here'
        </div>
      </div>)
    const { licensed, described } = definition
    const sourceUrl = this.getSourceUrl(definition)
    return (
      <Row>
        <Col md={6} >
          <h5>Descriptive info</h5>
          <Row>
            <Col md={3} >
              <p>Source:</p>
              <p>Date:</p>
            </Col>
            <Col md={9} >
              <p>{sourceUrl}</p>
              <p>{described && described.releaseDate}</p>
            </Col>
          </Row>
        </Col>
        <Col md={6} >
          <h5>License info</h5>
          <Row>
            <Col md={3} >
              <p>License:</p>
              <p>Copyright:</p>
            </Col>
            <Col md={9} >
              <p><span className='list-singleLine'>{get(licensed, 'license.expression')}</span></p>
              <p><span className='list-singleLine'>{get(licensed, 'copyright.holders', []).join(', ')}</span></p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  getImage(component) {
    if (component.provider === 'github')
      return github
    if (component.provider === 'npmjs')
      return npm
    return null
  }

  rowHeight({ index }, showExpanded = false) {
    return showExpanded ? 150 : 50
  }

  renderRow({ index, key, style }, toggleExpanded = null, showExpanded = false) {
    const { list } = this.props
    const component = list.list[index]
    const clickHandler = toggleExpanded ? () => toggleExpanded(index) : null
    return (
      <div key={key} style={style}>
        <TwoLineEntry
          image={this.getImage(component)}
          headline={this.renderHeadline(component)}
          message={this.renderMessage(component)}
          buttons={this.renderButtons(component)}
          onClick={clickHandler}
          panel={showExpanded ? this.renderPanel(component) : null}
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
      allowExpand
      rowHeight={this.rowHeight}
      noRowsRenderer={noRowsRenderer}
      fetchingRenderer={fetchingRenderer}
      sortOrder={sortOrder}
      contentSeq={contentSeq}
    />)
  }
}
