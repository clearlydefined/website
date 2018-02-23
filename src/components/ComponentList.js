// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React from 'react';
import PropTypes from 'prop-types'
import { RowEntityList, TwoLineEntry } from './'
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { clone, get } from 'lodash'
import FontAwesome from 'react-fontawesome'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import EntitySpec from '../utils/entitySpec'
// import two from '../images/2.svg'
import { getBadgeUrl } from '../api/clearlyDefined';


export default class ComponentList extends React.Component {

  static propTypes = {
    list: PropTypes.object.isRequired,
    listHeight: PropTypes.number,
    loadMoreRows: PropTypes.func,
    onRemove: PropTypes.func,
    onAddComponent: PropTypes.func,
    onChange: PropTypes.func,
    onCurate: PropTypes.func,
    onInspect: PropTypes.func,
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
  
  componentWillReceiveProps(newProps) {
    if (newProps.definitions.sequence !== this.props.definitions.sequence)
      this.incrementSequence()
  }

  removeComponent(component, event) {
    event.stopPropagation()
    const { onRemove } = this.props
    onRemove && onRemove(component)
  }

  inspectComponent(component, event) {
    event.stopPropagation()
    const action = this.props.onInspect
    action && action(component)
  }

  curateComponent(component, event) {
    event.stopPropagation()
    const action = this.props.onCurate
    action && action(component)
  }

  addSourceForComponent(component, event) {
    event.stopPropagation()
    const definition = this.props.definitions.entries[component.toPath()]
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromSourceCoordinates(sourceLocation)
    const action = this.props.onAddComponent
    action && sourceEntity && action(sourceEntity, component)
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

  renderButtonWithTip(button, tip) {
    const toolTip = <Tooltip id="tooltip">{tip}</Tooltip>
    return <OverlayTrigger placement="top" overlay={toolTip}>
      {button}
    </OverlayTrigger>
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  renderButtons(component) {
    const isSourceComponent = this.isSourceComponent(component)
    return (
      <div className='list-activity-area'>
        {!isSourceComponent && 
          <Button className='list-hybrid-button' onClick={this.addSourceForComponent.bind(this, component)}>
            <FontAwesome name={'plus'}/> 
            <span>&nbsp;Add source</span>
          </Button>
        }
        {this.renderButtonWithTip(
          <FontAwesome name={'edit'} className='list-fa-button' onClick={this.curateComponent.bind(this, component)} />,
          'Curate this definition'
        )}
        {this.renderButtonWithTip(
          <FontAwesome name={'search'} className='list-fa-button' onClick={this.inspectComponent.bind(this, component)} />,
          'Dig into this definition'
        )}
        {/* <img className='list-buttons' width='45px' src={two} alt='score'/> */}
        <img className='list-buttons' src={getBadgeUrl(component)} alt='score'/>
        <FontAwesome name={'times'} className='list-remove' onClick={this.removeComponent.bind(this, component)} />
      </div>)
  }

  renderHeadline(component) {
    const { namespace, name, revision } = component
    const namespaceText = namespace ? (namespace + '/') : ''
    const definition = this.props.definitions.entries[component.toPath()]
    const sourceUrl = this.getSourceUrl(definition)
    let revisionText = <span>&nbsp;&nbsp;&nbsp;{revision}</span>
    if (definition) {
      const location = get(definition, 'described.sourceLocation')
      if (!location || (component.provider === location.provider && revision === location.revision))
        revisionText = ''
    }
    return (<span>{namespaceText}{name}{revisionText}&nbsp;&nbsp;&nbsp;{sourceUrl}</span>)
  }

  renderMessage(component) {
    const definition = this.props.definitions.entries[component.toPath()]
    const licenseExpression = definition ? get(definition, 'licensed.license.expression') : ''
    return (<span>{licenseExpression} </span>)
  }

  getSourceUrl(definition) {
    const location = get(definition, 'described.sourceLocation')
    if (!location)
      return ''
    switch (location.provider) {
      case 'github':
        return <a href={`${location.url}/commit/${location.revision}`} target='_blank'>{location.revision}</a>
      default:
        return ''
    }
  }

  getPercentage(count, total) {
    return Math.round(((count || 0) / total) * 100)
  }

  renderPanel(component) {
    const definition = this.props.definitions.entries[component.toPath()]
    if (!definition)
      return (<div className='list-noRows'>
        <div>
          'Nothing to see here'
        </div>
      </div>)
    const { licensed, described } = definition
    const sourceUrl = this.getSourceUrl(definition)
    const facetsText = this.isSourceComponent(component) ? 'Core, Tests, Examples, Data, Doc' : 'Core'
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'license.unknown') 
    const unattributed = get(licensed, 'copyright.unknown')
    const unlicensedPercent = totalFiles ? this.getPercentage(unlicensed, totalFiles) : null;
    const unattributedPercent = totalFiles ? this.getPercentage(unattributed, totalFiles) : null;
    return (
      <Row>
        <Col md={5} >
          <Row>
            <Col md={2} >
              <p><b>Source</b></p>
              <p><b>Release</b></p>
            </Col>
            <Col md={10} >
              <p>{sourceUrl}&nbsp;</p>
              <p>{described && described.releaseDate}</p>
            </Col>
          </Row>
        </Col>
        <Col md={7} >
          <Row>
            <Col md={2} >
              <p><b>Attribution</b></p>
            </Col>
            <Col md={9} >
              <p><span className='list-singleLine'>{get(licensed, 'copyright.holders', []).join(', ')}</span></p>
            </Col>
          </Row>
          <Row>
            <Col md={2} >
              <p><b>Files</b></p>
            </Col>
            <Col md={10} >
              <p>
                Total: <b>{totalFiles || '?'}</b>, 
                Unlicensed: <b>{unlicensed ? `${unlicensed} (${unlicensedPercent}%)` : '?'}</b>, 
                Unattributed: <b>{unattributed ? `${unattributed} (${unattributedPercent}%)` : '?'}</b>, 
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={2} >
              <p><b>Harvesters</b></p>
            </Col>
            <Col md={9} >
              <p><span className='list-singleLine'>{get(described, 'tools', []).join(', ')}</span></p>
            </Col>
          </Row>
          <Row>
            <Col md={2} >
              <p><b>Facets</b></p>
            </Col>
            <Col md={9} >
              <p><span className='list-singleLine'>{facetsText}</span></p>
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
