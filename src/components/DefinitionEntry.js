// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { TwoLineEntry, InlineEditor, ModalEditor, SourcePicker } from './'
import { Row, Col, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap'
import { get, isEqual, union } from 'lodash'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import pypi from '../images/pypi.png'
import gem from '../images/gem.png'
import nuget from '../images/nuget.svg'
import Contribution from '../utils/contribution'
import Definition from '../utils/definition'

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

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  fieldChange(field, equality = isEqual, transform = a => a) {
    const { onChange, component } = this.props
    return value => {
      const proposedValue = transform(value)
      const isChanged = !equality(proposedValue, this.getOriginalValue(field))
      const newChanges = { ...component.changes }
      if (isChanged) newChanges[field] = proposedValue
      else delete newChanges[field]
      onChange && onChange(component, newChanges)
    }
  }

  getOriginalValue(field) {
    return get(this.props.definition, field)
  }

  ifDifferent(field, then_, else_) {
    return this.props.otherDefinition && !isEqual(get(this.props.otherDefinition, field), this.getOriginalValue(field))
      ? then_
      : else_
  }

  classIfDifferent(field) {
    return this.ifDifferent(field, this.props.classOnDifference, '')
  }

  getValue(field) {
    const { component } = this.props
    return (component.changes && component.changes[field]) || this.getOriginalValue(field)
  }

  renderHeadline(definition) {
    const { namespace, name, revision } = definition.coordinates
    const componentUrl = this.getComponentUrl(definition.coordinates)
    const revisionUrl = this.getRevisionUrl(definition.coordinates)
    const namespaceText = namespace ? namespace + '/' : ''
    const componentTag = componentUrl ? (
      <span>
        <a href={componentUrl} target="_blank" rel="noopener noreferrer">
          {namespaceText}
          {name}
        </a>
      </span>
    ) : (
      <span>
        {namespaceText}
        {name}
      </span>
    )
    const revisionTag = revisionUrl ? (
      <span>
        &nbsp;&nbsp;&nbsp;
        <a href={revisionUrl} target="_blank" rel="noopener noreferrer">
          {revision}
        </a>
      </span>
    ) : (
      <span>
        &nbsp;&nbsp;&nbsp;
        {revision}
      </span>
    )
    return (
      <span>
        {componentTag}
        {revisionTag}
      </span>
    )
  }

  renderWithToolTipIfDifferent(field, content, placement = 'right', transform = x => x) {
    const toolTip = (
      <Tooltip id={`tooltip-${field}`} className="definition__tooltip">
        Original: {transform(get(this.props.otherDefinition, field))}
      </Tooltip>
    )
    return this.ifDifferent(
      field,
      <OverlayTrigger placement={placement} overlay={toolTip}>
        <span className="definition__overlay-hover-catcher">{content}</span>
      </OverlayTrigger>,
      content
    )
  }

  renderMessage(definition) {
    const licenseExpression = definition ? get(definition, 'licensed.declared') : null
    return licenseExpression ? (
      this.renderWithToolTipIfDifferent(
        'licensed.declared',
        <span className={this.classIfDifferent('licensed.declared')}>{licenseExpression}</span>
      )
    ) : (
      <span>&nbsp;</span>
    )
  }

  getRevisionUrl(coordinates) {
    if (!coordinates.revision) return
    switch (coordinates.provider) {
      case 'github':
        return `${this.getComponentUrl(coordinates)}/commit/${coordinates.revision}`
      case 'npmjs':
        return `${this.getComponentUrl(coordinates)}/v/${coordinates.revision}`
      case 'nuget':
        return `${this.getComponentUrl(coordinates)}/${coordinates.revision}`
      case 'mavencentral':
        return `${this.getComponentUrl(coordinates)}/${coordinates.revision}`
      case 'pypi':
        return `${this.getComponentUrl(coordinates)}/${coordinates.revision}`
      case 'rubygems':
        return `${this.getComponentUrl(coordinates)}/versions/${coordinates.revision}`
      default:
        return
    }
  }

  getComponentUrl(coordinates) {
    switch (coordinates.provider) {
      case 'github':
        return `https://github.com/${coordinates.namespace}/${coordinates.name}`
      case 'npmjs':
        return `https://npmjs.com/package/${
          coordinates.namespace ? coordinates.namespace + '/' + coordinates.name : coordinates.name
        }`
      case 'nuget':
        return `https://nuget.org/packages/${coordinates.name}`
      case 'mavencentral':
        return `https://mvnrepository.com/artifact/${coordinates.namespace}/${coordinates.name}`
      case 'pypi':
        return `https://pypi.org/project/${coordinates.name}`
      case 'rubygems':
        return `https://rubygems.org/gems/${coordinates.name}`
      default:
        return
    }
  }

  getPercentage(count, total) {
    return Math.round(((count || 0) / total) * 100)
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

  renderLabel(text) {
    return <b>{text}</b>
  }

  renderPanel(rawDefinition) {
    if (!rawDefinition)
      return (
        <div className="list-noRows">
          <div>'Nothing to see here'</div>
        </div>
      )

    // TODO: find a way of calling this method less frequently. It's relatively expensive.
    const definition = this.foldFacets(rawDefinition, this.props.activeFacets)
    const { licensed } = definition
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'discovered.unknown')
    const unattributed = get(licensed, 'attribution.unknown')
    const unlicensedPercent = totalFiles ? this.getPercentage(unlicensed, totalFiles) : '-'
    const unattributedPercent = totalFiles ? this.getPercentage(unattributed, totalFiles) : '-'
    const { readOnly, onRevert } = this.props
    return (
      <Row>
        <Col md={5}>
          <Row>
            <Col md={2}>{this.renderLabel('Declared', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'licensed.declared',
                <InlineEditor
                  extraClass={this.classIfDifferent('licensed.declared')}
                  readOnly={readOnly}
                  type="license"
                  initialValue={this.getOriginalValue('licensed.declared')}
                  value={this.getValue('licensed.declared')}
                  onChange={this.fieldChange('licensed.declared')}
                  validator={value => true}
                  placeholder={'SPDX license'}
                  onRevert={() => onRevert('licensed.declared')}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Source', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'described.sourceLocation',
                <ModalEditor
                  extraClass={this.classIfDifferent('described.sourceLocation')}
                  readOnly={readOnly}
                  initialValue={Contribution.printCoordinates(this.getOriginalValue('described.sourceLocation'))}
                  value={Contribution.printCoordinates(this.getValue('described.sourceLocation'))}
                  onChange={this.fieldChange('described.sourceLocation', isEqual, Contribution.toSourceLocation)}
                  editor={SourcePicker}
                  validator={value => true}
                  placeholder={'Source location'}
                  onRevert={() => onRevert('described.sourceLocation')}
                />,
                'right',
                Contribution.printCoordinates
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Release', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'described.releaseDate',
                <InlineEditor
                  extraClass={this.classIfDifferent('described.releaseDate')}
                  readOnly={readOnly}
                  type="date"
                  initialValue={Contribution.printDate(this.getOriginalValue('described.releaseDate'))}
                  value={Contribution.printDate(this.getValue('described.releaseDate'))}
                  onChange={this.fieldChange('described.releaseDate')}
                  validator={value => true}
                  placeholder={'YYYY-MM-DD'}
                  onRevert={() => onRevert('described.releaseDate')}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row>
            <Col md={2}>{this.renderLabel('Discovered')}</Col>
            <Col md={10} className="definition__line">
              {this.renderPopover(licensed, 'discovered.expressions', 'Discovered')}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Attribution', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderPopover(licensed, 'attribution.parties', 'Attributions')}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Files')}</Col>
            <Col md={10} className="definition__line">
              <p className="list-singleLine">
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

  renderPopover(licensed, key, title) {
    const values = get(licensed, key, [])
    // compare facets without folding
    if (key === 'attribution.parties') key = 'licensed.facets'
    const classIfDifferent = this.classIfDifferent(key)
    if (!values) return null

    return (
      <OverlayTrigger
        trigger="click"
        placement="left"
        rootClose
        overlay={
          <Popover title={title} id={title}>
            <div className="popoverRenderer popoverRenderer_scrollY">
              {values.map((a, index) => (
                <div key={`${a}_${index}`} className="popoverRenderer__items">
                  <div className="popoverRenderer__items__value">
                    <span>{a}</span>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        }
      >
        <span className={`popoverSpan ${classIfDifferent}`}>{values.join(', ')}</span>
      </OverlayTrigger>
    )
  }

  getImage(definition) {
    if (definition.coordinates.provider === 'github') return github
    if (definition.coordinates.provider === 'npmjs') return npm
    if (definition.coordinates.provider === 'pypi') return pypi
    if (definition.coordinates.provider === 'rubygems') return gem
    if (definition.coordinates.provider === 'nuget') return nuget
    return null
  }

  render() {
    const { definition, onClick, renderButtons, component, draggable } = this.props
    return (
      <TwoLineEntry
        draggable={draggable}
        item={component}
        highlight={component.changes && !!Object.getOwnPropertyNames(component.changes).length}
        image={this.getImage(definition)}
        letter={definition.coordinates.type.slice(0, 1).toUpperCase()}
        headline={this.renderHeadline(definition)}
        message={this.renderMessage(definition)}
        buttons={renderButtons && renderButtons(definition)}
        onClick={!Definition.isDefinitionEmpty(definition) ? onClick : null}
        isEmpty={Definition.isDefinitionEmpty(definition)}
        panel={component.expanded ? this.renderPanel(definition) : null}
      />
    )
  }
}
