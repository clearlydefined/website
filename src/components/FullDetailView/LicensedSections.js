// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import get from 'lodash/get'
import { Row, Col } from 'react-bootstrap'
import InlineEditor from '../InlineEditor'
import Curation from '../../utils/curation'
import Contribution from '../../utils/contribution'
import LabelRenderer from '../Renderers/LabelRenderer'
import ListDataRenderer from './ListDataRenderer'

const LicensedSection = props => {
  const {
    rawDefinition,
    activeFacets,
    readOnly,
    onChange,
    previewDefinition,
    curationSuggestions,
    applyCurationSuggestion,
    handleRevert
  } = props
  // TODO: find a way of calling this method less frequently. It's relatively expensive.
  const definition = Contribution.foldFacets(rawDefinition, activeFacets)
  const { licensed } = definition
  const totalFiles = get(licensed, 'files')
  const unlicensed = get(licensed, 'discovered.unknown')
  const unattributed = get(licensed, 'attribution.unknown')
  const unlicensedPercent = totalFiles ? Contribution.getPercentage(unlicensed, totalFiles) : '-'
  const unattributedPercent = totalFiles ? Contribution.getPercentage(unattributed, totalFiles) : '-'

  return (
    <Row>
      <Col md={6}>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text="Declared" />
          </Col>
          <Col md={9} className="definition__line">
            <InlineEditor
              extraClass={Contribution.classIfDifferent(definition, previewDefinition, 'licensed.declared')}
              readOnly={readOnly}
              type="license"
              initialValue={Contribution.getOriginalValue(definition, 'licensed.declared')}
              value={Contribution.getValue(definition, previewDefinition, 'licensed.declared')}
              onChange={value => onChange(`licensed.declared`, value)}
              validator={true}
              placeholder={'SPDX license'}
              onRevert={() => handleRevert('licensed.declared')}
              suggested={Curation.getValue(curationSuggestions, 'licensed.declared')}
              onApplySuggestion={() => applyCurationSuggestion('licensed.declared')}
            />
          </Col>
        </Row>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text="Discovered" />
          </Col>
          <Col md={9} className="definition__line">
            <ListDataRenderer licensed={licensed} item={'discovered.expressions'} title={'Discovered'} />
          </Col>
        </Row>
      </Col>
      <Col md={6}>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text="Attribution" />
          </Col>
          <Col md={9} className="definition__line">
            <ListDataRenderer licensed={licensed} item={'attribution.parties'} title={'Attributions'} />
          </Col>
        </Row>
        <Row className="no-gutters">
          <Col md={3}>
            <LabelRenderer text="Files" />
          </Col>
          <Col md={9} className="definition__line">
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

export default LicensedSection
