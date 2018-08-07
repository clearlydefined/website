// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import { get, isEqual, union } from 'lodash'
import moment from 'moment'

import FileList from '../FileList'
import { InlineEditor } from '../'

import github from '../../images/GitHub-Mark-120px-plus.png'
import npm from '../../images/n-large.png'
import pypi from '../../images/pypi.png'
import gem from '../../images/gem.png'
import nuget from '../../images/nuget.svg'

import 'antd/dist/antd.css'

class FullDetailComponent extends Component {
  constructor(props) {
    super(props)
  }

  getImage(item) {
    if (item.coordinates.provider === 'github') return github
    if (item.coordinates.provider === 'npmjs') return npm
    if (item.coordinates.provider === 'pypi') return pypi
    if (item.coordinates.provider === 'rubygems') return gem
    if (item.coordinates.provider === 'nuget') return nuget
    return null
  }

  handleSave = () => {}

  handleClose = () => {}

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

  isSourceComponent = component => ['github', 'sourcearchive'].includes(component.provider)

  getPercentage = (count, total) => Math.round((count || 0) / total * 100)

  renderLabel(text, editable = false) {
    return (
      <p>
        <b>
          {text} <i className={false ? 'fas fa-pencil-alt' : ''} />
        </b>
      </p>
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

  ifDifferent(field, then_, else_) {
    return this.props.otherDefinition && !isEqual(get(this.props.otherDefinition, field), this.getOriginalValue(field))
      ? then_
      : else_
  }

  classIfDifferent = field => this.ifDifferent(field, this.props.classOnDifference, '')

  getOriginalValue = field => get(this.props.definition, field);

  getValue = field => this.getOriginalValue(field)

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

  printCoordinates(value) {
    return value ? `${value.url}/commit/${value.revision}` : null
  }

  printDate = value => !value ? null : moment(value).format('YYYY-MM-DD')

  printArray = value => !value ? null : value.join(', ')

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
    const initialFacets =
      get(described, 'facets') || this.isSourceComponent(definition.coordinates)
        ? ['Core', 'Data', 'Dev', 'Doc', 'Examples', 'Tests']
        : ['Core']
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'discovered.unknown')
    const unattributed = get(licensed, 'attribution.unknown')
    const unlicensedPercent = totalFiles ? this.getPercentage(unlicensed, totalFiles) : '-'
    const unattributedPercent = totalFiles ? this.getPercentage(unattributed, totalFiles) : '-'
    const toolList = get(described, 'tools', []).map(tool => (tool.startsWith('curation') ? tool.slice(0, 16) : tool))
    const { readOnly } = this.props
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
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Source', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'described.sourceLocation',
                <InlineEditor
                  extraClass={this.classIfDifferent('described.sourceLocation')}
                  readOnly={readOnly}
                  type="text"
                  initialValue={this.printCoordinates(this.getOriginalValue('described.sourceLocation'))}
                  value={this.printCoordinates(this.getValue('described.sourceLocation'))}
                  onChange={this.fieldChange('described.sourceLocation', isEqual, this.parseCoordinates)}
                  validator={value => true}
                  placeholder={'Source location'}
                />,
                'right',
                this.printCoordinates
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
                  initialValue={this.printDate(this.getOriginalValue('described.releaseDate'))}
                  value={this.printDate(this.getValue('described.releaseDate'))}
                  onChange={this.fieldChange('described.releaseDate')}
                  validator={value => true}
                  placeholder={'YYYY-MM-DD'}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Facets', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'described.facets',
                <p className={`list-singleLine ${this.classIfDifferent('described.facets')}`}>
                  {readOnly ? null : <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                  {this.printArray(initialFacets)}
                </p>
              )}
            </Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row>
            <Col md={2}>{this.renderLabel('Discovered')}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'discovered.expressions',
                <p className={`list-singleLine ${this.classIfDifferent('licensed.discovered.expressions')}`}>
                  {get(licensed, 'discovered.expressions', []).join(', ')}
                </p>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Attribution', true)}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'licensed.attribution.parties',
                <p className={`list-singleLine ${this.classIfDifferent('licensed.attribution.parties')}`}>
                  {get(licensed, 'attribution.parties', []).join(', ')}
                </p>
              )}
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
          <Row>
            <Col md={2}>{this.renderLabel('Tools')}</Col>
            <Col md={10} className="definition__line">
              {this.renderWithToolTipIfDifferent(
                'described.tools',
                <p className={`list-singleLine ${this.classIfDifferent('described.tools')}`}>{toolList.join(', ')}</p>,
                'bottom',
                x => (x ? x.join(', ') : '')
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderHeader() {
    const { curation, definition, harvest, path, modalView } = this.props

    const item = definition.item

    const haveUnsavedChanges = false

    return (
      <Row>
        <Col md={8} className="detail-header">
          <h2>{item && item.coordinates.name}</h2>
          <p>commit id: {item.described.sourceLocation.revision}</p>
        </Col>
        <Col md={4} className="text-right">
          {!modalView && <Button onClick={() => alert('Contribute')}>Contribute</Button>}
          {' '}
          {<Button disabled={haveUnsavedChanges} onClick={this.handleSave}>Save</Button>}
          {' '}
          {modalView && <Button onClick={this.handleClose}>Close</Button> }
        </Col>
      </Row>
    )
  }

  renderFacetsEditor() {
    return (
      <div>
        <h2>Facets editor</h2>
        <p>facets editor goes here</p>
      </div>
    )
  }

  renderContributions() {
    return (
      <div>
        <h2>Contributions</h2>
        <p>contributions go here</p>
      </div>
    )
  }

  render() {
    const { curation, definition, harvest, path } = this.props

    if (!definition || !definition.item) return null
    console.log(definition)

    const item = definition.item
    const image = this.getImage(item);

    return (
      <div>
        <Row>
          <Col md={1}>
            {image && <img className={`list-image`} src={image} alt="" />}
          </Col>
          <Col md={11}>
            {this.renderHeader()}
            {this.renderPanel(item)}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {this.renderFacetsEditor()}
          </Col>
          <Col md={6}>
            {this.renderContributions()}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <FileList files={item.files} />
          </Col>
        </Row>
      </div>
    )
  }
}

FullDetailComponent.propTypes = {
  // onClose: PropTypes.func.isRequired,
  definition: PropTypes.object.isRequired,
}

export default FullDetailComponent
