// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { FileList, InlineEditor, Section } from './'
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { get, isEqual, union } from 'lodash'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import pypi from '../images/pypi.png'
import gem from '../images/gem.png'
import nuget from '../images/nuget.svg'
import moment from 'moment'

export default class DefinitionDetails extends React.Component {
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
        <a href={componentUrl} target="_blank">
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
        &nbsp;&nbsp;&nbsp;<a href={revisionUrl} target="_blank">
          {revision}
        </a>
      </span>
    ) : (
      <span>&nbsp;&nbsp;&nbsp;{revision}</span>
    )
    return (
      <span className="details-headline">
        {componentTag}
        {revisionTag}
      </span>
    )
  }

  renderMessage(definition) {
    const licenseExpression = definition ? get(definition, 'licensed.declared') : null
    return licenseExpression ? <span>{licenseExpression}</span> : <span>&nbsp;</span>
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

  parseArray(value) {
    return value ? value.split(',').map(v => v.trim()) : null
  }

  printArray(value) {
    return value ? value.join(', ') : null
  }

  printDate(value) {
    return value ? moment(value).format('YYYY-MM-DD') : null
  }

  parseDate(value) {
    return moment(value)
  }

  printCoordinates(value) {
    return value ? `${value.url}/commit/${value.revision}` : null
  }

  parseCoordinates(value) {
    if (!value) return null
    const segments = value.split('/')
    return { type: 'git', provider: 'github', url: value, revision: segments[6] }
  }

  renderLabel(text, editable = false) {
    return (
      <p>
        <b>
          {text} <i className={false ? 'fas fa-pencil-alt' : ''} />
        </b>
      </p>
    )
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
    return (
      <Row>
        <Col md={5}>
          <Row>
            <Col md={2}>{this.renderLabel('Declared', true)}</Col>
            <Col md={10}>
              <InlineEditor
                type="text"
                initialValue={this.getOriginalValue('licensed.declared')}
                value={this.getValue('licensed.declared')}
                onChange={this.fieldChange('licensed.declared')}
                validator={value => true}
                placeholder={'SPDX license'}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Source', true)}</Col>
            <Col md={10}>
              <InlineEditor
                type="text"
                initialValue={this.printCoordinates(this.getOriginalValue('described.sourceLocation'))}
                value={this.printCoordinates(this.getValue('described.sourceLocation'))}
                onChange={this.fieldChange('described.sourceLocation', isEqual, this.parseCoordinates)}
                validator={value => true}
                placeholder={'Source location'}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Release', true)}</Col>
            <Col md={10}>
              <InlineEditor
                type="date"
                initialValue={this.printDate(this.getOriginalValue('described.releaseDate'))}
                value={this.printDate(this.getValue('described.releaseDate'))}
                onChange={this.fieldChange('described.releaseDate')}
                validator={value => true}
                placeholder={'YYYY-MM-DD'}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Facets', true)}</Col>
            <Col md={10}>
              <p className="list-singleLine"> &nbsp;&nbsp;&nbsp;&nbsp;{this.printArray(initialFacets)}</p>
            </Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row>
            <Col md={2}>{this.renderLabel('Discovered')}</Col>
            <Col md={10}>
              <p className="list-singleLine">{get(licensed, 'discovered.expressions', []).join(', ')}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Attribution', true)}</Col>
            <Col md={10}>
              <p className="list-singleLine">{get(licensed, 'attribution.parties', []).join(', ')}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Files')}</Col>
            <Col md={10}>
              <p className="list-singleLine">
                Total: <b>{totalFiles || '0'}</b>, Unlicensed:{' '}
                <b>{isNaN(unlicensed) ? '-' : `${unlicensed} (${unlicensedPercent}%)`}</b>, Unattributed:{' '}
                <b>{isNaN(unattributed) ? '-' : `${unattributed} (${unattributedPercent}%)`}</b>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>{this.renderLabel('Tools')}</Col>
            <Col md={10}>
              <p className="list-singleLine">{toolList.join(', ')}</p>
            </Col>
          </Row>
        </Col>
      </Row>
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

  renderImage(definition, highlight = false) {
    const image = this.getImage(definition)
    if (!image) return null
    return <img className={`details-image${highlight ? ' list-highlight' : ''}`} src={image} alt="" />
  }

  renderFacets(definition) {
    return (
      <div>
        <Row>
          <Col md={2}>core</Col>
          <Col md={10}>Everything that is not in some other facet</Col>
        </Row>
        <Row>
          <Col md={2}>data</Col>
          <Col md={10}> **/*.csv</Col>
        </Row>
        <Row>
          <Col md={2}>dev</Col>
          <Col md={10} />
        </Row>
        <Row>
          <Col md={2}>doc</Col>
          <Col md={10} />
        </Row>
        <Row>
          <Col md={2}>examples</Col>
          <Col md={10}>src/examples/**/*.js</Col>
        </Row>
        <Row>
          <Col md={2}>test</Col>
          <Col md={10}>test/**/*.js, testrunner.js</Col>
        </Row>
      </div>
    )
  }

  renderFileList(definition) {
    return <FileList definition={definition} />
  }

  renderRawData(definition) {
    return 'Likely a tabbed view of the different raw data forms (Harvested data, raw defintion, current curation)'
  }

  renderContributions(definition) {
    return 'A list of all existing contributions (PRs) that have been made to the defintiion. This might be a standard "two line" entry list'
  }

  render() {
    const { definition, onClick, renderButtons, component } = this.props
    return (
      <div>
        <Row>
          <Col md={1}>{this.renderImage(definition)}</Col>
          <Col md={11}>{this.renderHeadline(definition)}</Col>
        </Row>
        <Section name="Details">{this.renderPanel(definition)}</Section>
        <Section name="Facets">{this.renderFacets(definition)}</Section>
        <Section name="Files">{this.renderFileList(definition)}</Section>
        <Section name="Contributions">{this.renderContributions(definition)}</Section>
        <Section name="Raw Data">{this.renderRawData(definition)}</Section>
      </div>
    )
  }
}
