// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import get from 'lodash/get'
import { Row, Col } from 'react-bootstrap'
import InlineEditor from '../InlineEditor'
import Curation from '../../utils/curation'
import Contribution from '../../utils/contribution'
import LabelRenderer from '../Renderers/LabelRenderer'

const DescribedSection = props => {
  const {
    rawDefinition,
    activeFacets,
    readOnly,
    onChange,
    previewDefinition,
    curationSuggestions,
    handleRevert,
    applyCurationSuggestion
  } = props
  // TODO: find a way of calling this method less frequently. It's relatively expensive.
  const definition = Contribution.foldFacets(rawDefinition, activeFacets)
  const toolList = get(definition.described, 'tools', []).map(
    tool => (tool.startsWith('curation') ? tool.slice(0, 16) : tool)
  )

  return (
    <Row>
      <Col md={6}>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text={'Source'} />
          </Col>
          <Col md={9} className="definition__line">
            <InlineEditor
              extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'described.sourceLocation')}
              readOnly={readOnly}
              type="text"
              initialValue={Contribution.printCoordinates(
                Contribution.getOriginalValue(definition, 'described.sourceLocation')
              )}
              value={Contribution.printCoordinates(
                Contribution.getValue(definition, previewDefinition, 'described.sourceLocation')
              )}
              onChange={value => onChange(`described.sourceLocation`, value, null, Contribution.parseCoordinates)}
              onRevert={() => handleRevert('described.sourceLocation')}
              validator
              placeholder={'Source location'}
              suggested={
                Curation.getValue(curationSuggestions, 'described.sourceLocation')
                  ? Contribution.printCoordinates(Curation.getValue(curationSuggestions, 'described.sourceLocation'))
                  : null
              }
              onApplySuggestion={() => applyCurationSuggestion('described.sourceLocation')}
            />
          </Col>
        </Row>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text={'Release'} />
          </Col>
          <Col md={9} className="definition__line">
            <InlineEditor
              extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'described.releaseDate')}
              readOnly={readOnly}
              type="date"
              initialValue={Contribution.printDate(Contribution.getOriginalValue(definition, 'described.releaseDate'))}
              value={Contribution.printDate(
                Contribution.getValue(definition, previewDefinition, 'described.releaseDate')
              )}
              onChange={value => onChange(`described.releaseDate`, value)}
              onRevert={() => handleRevert('described.releaseDate')}
              validator
              placeholder={'YYYY-MM-DD'}
              suggested={
                Curation.getValue(curationSuggestions, 'described.releaseDate')
                  ? Contribution.printDate(Curation.getValue(curationSuggestions, 'described.releaseDate'))
                  : null
              }
              onApplySuggestion={() => applyCurationSuggestion('described.releaseDate')}
            />
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text={'Tools'} />
          </Col>
          <Col md={9} className="definition__line">
            <p
              className={`list-singleLine ${Contribution.classIfDifferent(
                definition,
                previewDefinition,
                'described.tools'
              )}`}
            >
              {toolList.join(', ')}
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default DescribedSection
