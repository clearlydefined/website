// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { TwoLineEntry, QuickEditModel, SourcePicker, FileCountRenderer } from './'
import { Checkbox, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap'
import { Tag } from 'antd'
import { get, isEqual, union } from 'lodash'
import git from '../images/Git-Logo-2Color.png'
import npm from '../images/n-large.png'
import pypi from '../images/pypi.png'
import gem from '../images/gem.png'
import cargo from '../images/cargo.png'
import nuget from '../images/nuget.svg'
import debian from '../images/debian.png'
import maven from '../images/maven.png'
import composer from '../images/packagist.png'
import Contribution from '../utils/contribution'
import Definition from '../utils/definition'
import Curation from '../utils/curation'
import { withResize } from '../utils/WindowProvider'
import ScoreRenderer from './Navigation/Ui/ScoreRenderer'
import DefinitionTitle from './Navigation/Ui/DefinitionTitle'
import DefinitionRevision from './Navigation/Ui/DefinitionRevision'

class DefinitionEntry extends React.Component {
  constructor(props) {
    super(props)
    this.handleModel = this.handleModel.bind(this)
    this.state = {
      modelOpen: false
    }
  }
  static propTypes = {
    onChange: PropTypes.func,
    onCurate: PropTypes.func,
    onInspect: PropTypes.func,
    activeFacets: PropTypes.array,
    definition: PropTypes.object.isRequired,
    curation: PropTypes.object.isRequired,
    component: PropTypes.object.isRequired,
    multiSelectEnabled: PropTypes.bool,
    renderButtons: PropTypes.func,
    isSelected: PropTypes.bool
  }

  static defaultProps = {}

  isSourceComponent(component) {
    return ['github', 'sourcearchive', 'debsrc'].includes(component.provider)
  }

  fieldChange(field, equality = isEqual, transform = a => a) {
    const { onChange, component } = this.props
    return value => {
      const proposedValue = transform(value)
      const isChanged = !equality(proposedValue, this.getOriginalValue(field))
      const newChanges = { ...component.changes }
      if (isChanged && proposedValue !== null) newChanges[field] = proposedValue
      else delete newChanges[field]
      onChange && onChange(component, newChanges, field)
    }
  }

  getOriginalValue(field) {
    return get(this.props.definition, field)
  }

  ifDifferent(field, then_, else_) {
    return !isEqual(this.getValue(field), this.getOriginalValue(field)) ? then_ : else_
  }

  classIfDifferent(field) {
    return this.ifDifferent(field, this.props.classOnDifference, '')
  }

  getValue(field) {
    const { component } = this.props
    return (component.changes && component.changes[field]) || this.getOriginalValue(field)
  }

  renderHeadline(definition, curation) {
    const scores = get(definition, 'scores')
    const { component } = this.props
    const isCurationPending = Curation.isPending(curation)
    const scoreTag = scores ? (
      <span className="score-badge-table">
        <ScoreRenderer scores={scores} definition={definition} />
      </span>
    ) : null
    const releasedDate = definition?.described?.releaseDate ? (
      <span className="releasedDate-table">{definition.described.releaseDate}</span>
    ) : (
      <span className="releasedDate-table">-- -- --</span>
    )
    const curationTag = isCurationPending ? (
      <span>
        &nbsp;&nbsp;
        <a href="https://github.com/clearlydefined/curated-data/pulls" target="_blank" rel="noopener noreferrer">
          <Tag className="cd-badge" color="green">
            {this.props.isMobile ? 'Pending' : 'Pending curations'}
          </Tag>
        </a>
      </span>
    ) : null
    return (
      <>
        <span className="table-title">
          <DefinitionTitle definition={definition} component={component} />
          &nbsp;/&nbsp;
          <span>
            <DefinitionRevision definition={definition} component={component} className={'definition-revision'} />
          </span>
        </span>

        {scoreTag}
        {releasedDate}
        {curationTag}
      </>
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
    const licenseExpression = definition ? this.getValue('licensed.declared') : null
    return licenseExpression
      ? this.renderWithToolTipIfDifferent(
        'licensed.declared',
        <span className={this.classIfDifferent('licensed.declared')}>{licenseExpression}</span>
      )
      : null
  }

  getPercentage(count, total) {
    return Math.round(((count || 0) / total) * 100)
  }

  foldFacets(definition, facets = null) {
    facets = facets || Contribution.defaultFacets
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
  handleModel() {
    this.setState({ modelOpen: !this.state.modelOpen })
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
    const { readOnly, onRevert } = this.props
    return (
      <div className="row row-panel-details">
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Declared')}:</span>
          <div className="panel-details__value">
            <p>{this.getValue('licensed.declared')}</p>
            {/* {this.renderWithToolTipIfDifferent(
              'licensed.declared',
              <LicensesRenderer
                definition={definition}
                field={'licensed.declared'}
                readOnly={readOnly}
                initialValue={this.getOriginalValue('licensed.declared')}
                value={this.getValue('licensed.declared')}
                onChange={this.fieldChange('licensed.declared')}
                revertable
                onRevert={() => onRevert('licensed.declared')}
              />
            )} */}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Discovered')}:</span>
          <div className="panel-details__value">
            {this.renderPopover(licensed, 'discovered.expressions', 'Discovered')}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Source')}:</span>
          <div className="panel-details__value">
            <p>{Contribution.printCoordinates(this.getValue('described.sourceLocation'))}</p>
            {/* {this.renderWithToolTipIfDifferent(
              'described.sourceLocation',
              <ModalEditor
                definition={definition}
                field={'described.sourceLocation'}
                extraClass={this.classIfDifferent('described.sourceLocation')}
                readOnly={readOnly}
                initialValue={Contribution.printCoordinates(this.getOriginalValue('described.sourceLocation'))}
                value={Contribution.printCoordinates(this.getValue('described.sourceLocation'))}
                onChange={this.fieldChange('described.sourceLocation', isEqual, Contribution.toSourceLocation)}
                editor={SourcePicker}
                validator={value => true}
                placeholder={'Source location'}
                revertable
                onRevert={() => onRevert('described.sourceLocation')}
              />,
              'right',
              Contribution.printCoordinates
            )} */}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Attribution')}:</span>
          <div className="panel-details__value">
            {this.renderPopover(licensed, 'attribution.parties', 'Attributions')}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Release')}:</span>
          <div className="panel-details__value">
            <p>{Contribution.printDate(this.getValue('described.releaseDate'))}</p>
            {/* {this.renderWithToolTipIfDifferent(
              'described.releaseDate',
              <InlineEditor
                field={'described.releaseDate'}
                extraClass={this.classIfDifferent('described.releaseDate')}
                readOnly={readOnly}
                type="date"
                initialValue={Contribution.printDate(this.getOriginalValue('described.releaseDate'))}
                value={Contribution.printDate(this.getValue('described.releaseDate'))}
                onChange={this.fieldChange('described.releaseDate')}
                validator={value => true}
                placeholder={'YYYY-MM-DD'}
                revertable
                onRevert={() => onRevert('described.releaseDate')}
              />
            )} */}
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-start align-items-center">
          <span className="panel-details__title">{this.renderLabel('Files')}:</span>
          <div className="panel-details__value">
            <FileCountRenderer definition={definition} />
          </div>
        </div>
        <div className="list-panel__quick-edit">
          <QuickEditModel
            open={this.state.modelOpen}
            closeModel={this.handleModel}
            definition={definition}
            field={'described.sourceLocation'}
            extraClass={this.classIfDifferent('described.sourceLocation')}
            readOnly={readOnly}
            initialValue={{
              declared: this.getOriginalValue('licensed.declared'),
              source: Contribution.printCoordinates(this.getOriginalValue('described.sourceLocation')),
              release: Contribution.printDate(this.getOriginalValue('described.releaseDate')),
              repo: ''
            }}
            values={{
              declared: this.getValue('licensed.declared'),
              source: Contribution.printCoordinates(this.getValue('described.sourceLocation')),
              release: Contribution.printDate(this.getValue('described.releaseDate')),
              repo: ''
            }}
            onChange={{
              declared: this.fieldChange('licensed.declared'),
              source: this.fieldChange('described.sourceLocation', isEqual, Contribution.toSourceLocation),
              release: this.fieldChange('described.releaseDate'),
              repo: ''
            }}
            editor={SourcePicker}
            validator={value => true}
            placeholder={'Source location'}
            revertable
            onRevert={() => onRevert('described.sourceLocation')}
          />
          <button onClick={this.handleModel} className="quick-edit-btn">
            Edit
          </button>
        </div>
      </div>
      // <Row>
      //   <Col sm={5}>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Declared')}</Col>
      //       <Col xs={9} className="definition__line">
      //         {this.renderWithToolTipIfDifferent(
      //           'licensed.declared',
      //           <LicensesRenderer
      //             definition={definition}
      //             field={'licensed.declared'}
      //             readOnly={readOnly}
      //             initialValue={this.getOriginalValue('licensed.declared')}
      //             value={this.getValue('licensed.declared')}
      //             onChange={this.fieldChange('licensed.declared')}
      //             revertable
      //             onRevert={() => onRevert('licensed.declared')}
      //           />
      //         )}
      //       </Col>
      //     </Row>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Source')}</Col>
      //       <Col xs={9} className="definition__line">
      //         {this.renderWithToolTipIfDifferent(
      //           'described.sourceLocation',
      //           <ModalEditor
      //             definition={definition}
      //             field={'described.sourceLocation'}
      //             extraClass={this.classIfDifferent('described.sourceLocation')}
      //             readOnly={readOnly}
      //             initialValue={Contribution.printCoordinates(this.getOriginalValue('described.sourceLocation'))}
      //             value={Contribution.printCoordinates(this.getValue('described.sourceLocation'))}
      //             onChange={this.fieldChange('described.sourceLocation', isEqual, Contribution.toSourceLocation)}
      //             editor={SourcePicker}
      //             validator={value => true}
      //             placeholder={'Source location'}
      //             revertable
      //             onRevert={() => onRevert('described.sourceLocation')}
      //           />,
      //           'right',
      //           Contribution.printCoordinates
      //         )}
      //       </Col>
      //     </Row>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Release')}</Col>
      //       <Col xs={9} className="definition__line">
      //         {this.renderWithToolTipIfDifferent(
      //           'described.releaseDate',
      //           <InlineEditor
      //             field={'described.releaseDate'}
      //             extraClass={this.classIfDifferent('described.releaseDate')}
      //             readOnly={readOnly}
      //             type="date"
      //             initialValue={Contribution.printDate(this.getOriginalValue('described.releaseDate'))}
      //             value={Contribution.printDate(this.getValue('described.releaseDate'))}
      //             onChange={this.fieldChange('described.releaseDate')}
      //             validator={value => true}
      //             placeholder={'YYYY-MM-DD'}
      //             revertable
      //             onRevert={() => onRevert('described.releaseDate')}
      //           />
      //         )}
      //       </Col>
      //     </Row>
      //   </Col>
      //   <Col sm={7}>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Discovered')}</Col>
      //       <Col xs={9} className="definition__line">
      //         {this.renderPopover(licensed, 'discovered.expressions', 'Discovered')}
      //       </Col>
      //     </Row>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Attribution')}</Col>
      //       <Col xs={9} className="definition__line">
      //         {this.renderPopover(licensed, 'attribution.parties', 'Attributions')}
      //       </Col>
      //     </Row>
      //     <Row>
      //       <Col xs={3}>{this.renderLabel('Files')}</Col>
      //       <Col xs={9} className="definition__line">
      //         <FileCountRenderer definition={definition} />
      //       </Col>
      //     </Row>
      //   </Col>
      // </Row>
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
    if (definition.coordinates.type === 'git') return git
    if (definition.coordinates.type === 'npm') return npm
    if (definition.coordinates.type === 'crate') return cargo
    if (definition.coordinates.type === 'pypi') return pypi
    if (definition.coordinates.type === 'gem') return gem
    if (definition.coordinates.type === 'maven') return maven
    if (definition.coordinates.type === 'nuget') return nuget
    if (definition.coordinates.type === 'deb') return debian
    if (definition.coordinates.type === 'composer') return composer
    return null
  }

  render() {
    const {
      component,
      definition,
      draggable,
      multiSelectEnabled,
      onClick,
      renderButtons,
      isSelected,
      toggleCheckbox
    } = this.props

    return (
      <>
        {multiSelectEnabled && (
          <Checkbox className="pull-left component-checkbox" onChange={toggleCheckbox} checked={isSelected} />
        )}
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
      </>
    )
  }
}

export default withResize(DefinitionEntry)
