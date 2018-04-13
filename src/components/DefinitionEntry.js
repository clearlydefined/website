// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { TwoLineEntry, InlineEditor } from './'
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { get, union } from 'lodash'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import moment from 'moment'

export default class DefinitionEntry extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onCurate: PropTypes.func,
    onInspect: PropTypes.func,
    activeFacets: PropTypes.array,
    definition: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    renderButtons: PropTypes.func
  }

  static defaultProps = {}

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

  fieldChange(field) {
    const { onChange, component } = this.props
    return value => {
      const newValue = value === this.getOriginalValue(field) ? undefined : value
      const newChanges = { ...component.changes }
      if (value === this.getOriginalValue(field)) delete newChanges[field]
      else newChanges[field] = newValue
      onChange && onChange(component, newChanges)
    }
  }

  getOriginalValue(field) {
    return get(this.props.definition, field)
  }

  getValue(field) {
    const { component } = this.props
    return (component.changes && component.changes[field]) || this.getOriginalValue(field)
  }

  renderHeadline(definition) {
    const { namespace, name, revision } = definition.coordinates
    const namespaceText = namespace ? namespace + '/' : ''
    const sourceUrl = this.getSourceUrl(definition)
    let revisionText = <span>&nbsp;&nbsp;&nbsp;{revision}</span>
    const location = get(definition, 'described.sourceLocation')
    if (!location || (definition.coordinates.provider === location.provider && revision === location.revision))
      revisionText = ''
    return (
      <span>
        {namespaceText}
        {name}
        {revisionText}&nbsp;&nbsp;&nbsp;{sourceUrl}
      </span>
    )
  }

  renderMessage(definition) {
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

  renderPanel(rawDefinition) {
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
    const facetsText = this.isSourceComponent(definition.coordinates) ? 'Core, Data, Dev, Doc, Examples, Tests' : 'Core'
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
              <p className="list-singleLine">{sourceUrl}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Release</b>
              </p>
            </Col>
            <Col md={10}>
              <InlineEditor
                type="text"
                initialValue={moment(this.getOriginalValue('described.releaseDate')).format('YYYY.MM.DD')}
                value={moment(this.getValue('described.releaseDate')).format('YYYY.MM.DD')}
                onChange={this.fieldChange('described.releaseDate')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Tools</b>
              </p>
            </Col>
            <Col md={9}>
              <p className="list-singleLine">{toolList.join(', ')}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Facets</b>
              </p>
            </Col>
            <Col md={10}>
              <p className="list-singleLine">{facetsText}</p>
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
              <InlineEditor
                type="text"
                initialValue={this.getOriginalValue('licensed.declared')}
                value={this.getValue('licensed.declared')}
                onChange={this.fieldChange('licensed.declared')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Discovered</b>
              </p>
            </Col>
            <Col md={9}>
              <p className="list-singleLine">{get(licensed, 'discovered.expressions', []).join(', ')}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <p>
                <b>Attribution</b>
              </p>
            </Col>
            <Col md={9}>
              <p className="list-singleLine">{get(licensed, 'attribution.parties', []).join(', ')}</p>
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

  getImage(definition) {
    if (definition.coordinates.provider === 'github') return github
    if (definition.coordinates.provider === 'npmjs') return npm
    return null
  }

  render() {
    const { definition, onClick, renderButtons, component } = this.props
    return (
      <TwoLineEntry
        highlight={component.changes && !!Object.getOwnPropertyNames(component.changes).length}
        image={this.getImage(definition)}
        letter={definition.coordinates.type.slice(0, 1).toUpperCase()}
        headline={this.renderHeadline(definition)}
        message={this.renderMessage(definition)}
        buttons={renderButtons && renderButtons(definition)}
        onClick={onClick}
        panel={component.expanded ? this.renderPanel(definition) : null}
      />
    )
  }
}
