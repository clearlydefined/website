// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { RowEntityList, TwoLineEntry, CopyUrlButton } from './'
import { Row, Col, Button, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap'
import { clone, get, union } from 'lodash'
import FontAwesome from 'react-fontawesome'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import EntitySpec from '../utils/entitySpec'
import { getBadgeUrl } from '../api/clearlyDefined'
import moment from 'moment'
import { ROUTE_INSPECT } from '../utils/routingConstants'

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
    activeFacets: PropTypes.array,
    definitions: PropTypes.object,
    githubToken: PropTypes.string
  }

  static defaultProps = {
    loadMoreRows: () => {}
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
    if (newProps.definitions.sequence !== this.props.definitions.sequence) this.incrementSequence()
    if (newProps.activeFacets !== this.props.activeFacets) this.incrementSequence()
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
    return (
      <OverlayTrigger placement="top" overlay={toolTip}>
        {button}
      </OverlayTrigger>
    )
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  renderButtons(component) {
    const isSourceComponent = this.isSourceComponent(component)
    return (
      <div className="list-activity-area">
        {/* <img className='list-buttons' width='45px' src={two} alt='score'/> */}
        <img className="list-buttons" src={getBadgeUrl(component)} alt="score" />
        <ButtonGroup>
          {!isSourceComponent && (
            <Button className="list-hybrid-button" onClick={this.addSourceForComponent.bind(this, component)}>
              <FontAwesome name={'plus'} />
              <span>&nbsp;Add source</span>
            </Button>
          )}
          {this.renderButtonWithTip(
            <Button>
              <FontAwesome
                name={'edit'}
                className="list-fa-button"
                onClick={this.curateComponent.bind(this, component)}
              />
            </Button>,
            'Curate this definition'
          )}
          {this.renderButtonWithTip(
            <Button>
              <FontAwesome
                name={'search'}
                className="list-fa-button"
                onClick={this.inspectComponent.bind(this, component)}
              />
            </Button>,
            'Dig into this definition'
          )}
          <CopyUrlButton route={ROUTE_INSPECT} path={component.toPath()} bsStyle="default" className="list-fa-button" />
        </ButtonGroup>
        <FontAwesome name={'times'} className="list-remove" onClick={this.removeComponent.bind(this, component)} />
      </div>
    )
  }

  renderHeadline(component) {
    const { namespace, name, revision } = component
    const namespaceText = namespace ? namespace + '/' : ''
    const definition = this.props.definitions.entries[component.toPath()]
    const sourceUrl = this.getSourceUrl(definition)
    let revisionText = <span>&nbsp;&nbsp;&nbsp;{revision}</span>
    if (definition) {
      const location = get(definition, 'described.sourceLocation')
      if (!location || (component.provider === location.provider && revision === location.revision)) revisionText = ''
    }
    return (
      <span>
        {namespaceText}
        {name}
        {revisionText}&nbsp;&nbsp;&nbsp;{sourceUrl}
      </span>
    )
  }

  renderMessage(component) {
    const definition = this.props.definitions.entries[component.toPath()]
    const licenseExpression = definition ? get(definition, 'licensed.facets.core.declared') : null
    return licenseExpression ? <span>{licenseExpression}</span> : <span>&nbsp;</span>
  }

  getSourceUrl(definition) {
    const location = get(definition, 'described.sourceLocation')
    if (!location) return ''
    switch (location.provider) {
      case 'github':
        return (
          <a href={`${location.url}/commit/${location.revision}`} target="_blank">
            {location.revision}
          </a>
        )
      default:
        return ''
    }
  }

  getPercentage(count, total) {
    return Math.round((count || 0) / total * 100)
  }

  foldFacets(definition, facets = null) {
    facets = facets || ['core', 'data', 'dev', 'docs', 'examples', 'tests']
    let files = 0
    let attributionUnknown = 0
    let discoveredUnknown = 0
    let parties = []
    let expressions = []
    let declared = []

    facets.forEach(name => {
      const facet = get(definition, `licensed.facets.${name}`)
      if (!facet) return
      files += facet.files || 0
      attributionUnknown += get(facet, 'attribution.unknown', 0)
      parties = union(parties, get(facet, 'attribution.parties', []))
      discoveredUnknown += get(facet, 'discovered.unknown', 0)
      expressions = union(expressions, get(facet, 'discovered.expressions', []))
      declared = union(declared, get(facet, 'declared', []))
    })

    return {
      coordinates: definition.coordinates,
      described: definition.described,
      licensed: {
        files,
        declared,
        discovered: { expressions, unknown: discoveredUnknown },
        attribution: { parties, unknown: attributionUnknown }
      }
    }
  }

  renderPanel(component) {
    const rawDefinition = this.props.definitions.entries[component.toPath()]
    if (!rawDefinition)
      return (
        <div className="list-noRows">
          <div>'Nothing to see here'</div>
        </div>
      )

    // TODO find a way of calling this less frequently. Relatively expensive.
    const definition = this.foldFacets(rawDefinition, this.props.activeFacets)
    const { licensed, described } = definition
    const sourceUrl = this.getSourceUrl(definition)
    const facetsText = this.isSourceComponent(component) ? 'Core, Data, Dev, Doc, Examples, Tests' : 'Core'
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'discovered.unknown')
    const unattributed = get(licensed, 'attribution.unknown')
    const unlicensedPercent = totalFiles ? this.getPercentage(unlicensed, totalFiles) : '-'
    const unattributedPercent = totalFiles ? this.getPercentage(unattributed, totalFiles) : '-'
    const toolList = get(described, 'tools', []).map(tool => (tool.startsWith('curation') ? tool.slice(0, 16) : tool))
    return (
      <Row>
        <Col md={5}>
          <Row>
            <Col md={2}>
              <p>
                <b>Source</b>
              </p>
            </Col>
            <Col md={10}>
              <p className="ellipsis">{sourceUrl}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Release</b>
              </p>
            </Col>
            <Col md={10}>
              <p>{described && described.releaseDate && moment(described.releaseDate).format('YYYY.MM.DD')}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Tools</b>
              </p>
            </Col>
            <Col md={9}>
              <p>
                <span className="list-singleLine">{toolList.join(', ')}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Facets</b>
              </p>
            </Col>
            <Col md={10}>
              <p>
                <span className="list-singleLine">{facetsText}</span>
              </p>
            </Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row>
            <Col md={2}>
              <p>
                <b>Declared</b>
              </p>
            </Col>
            <Col md={9}>
              <p>{licensed && licensed.declared}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Discovered</b>
              </p>
            </Col>
            <Col md={9}>
              <p>
                <span className="list-singleLine">{get(licensed, 'discovered.expressions', []).join(', ')}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Attribution</b>
              </p>
            </Col>
            <Col md={9}>
              <p>
                <span className="list-singleLine">{get(licensed, 'attribution.parties', []).join(', ')}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Files</b>
              </p>
            </Col>
            <Col md={10}>
              <p>
                Total: <b>{totalFiles || '0'}</b>, Unlicensed:{' '}
                <b>{isNaN(unlicensed) ? '-' : `${unlicensed} (${unlicensedPercent}%)`}</b>, Unattributed:{' '}
                <b>{isNaN(unattributed) ? '-' : `${unattributed} (${unattributedPercent}%)`}</b>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  getImage(component) {
    if (component.provider === 'github') return github
    if (component.provider === 'npmjs') return npm
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
      </div>
    )
  }

  render() {
    const { loadMoreRows, listHeight, noRowsRenderer, list, fetchingRenderer } = this.props
    const { sortOrder, contentSeq } = this.state
    return (
      <RowEntityList
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
      />
    )
  }
}
