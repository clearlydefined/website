// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React from 'react'
import { Row, Button, Col } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import { getBadgeUrl } from '../../api/clearlyDefined'
import Definition from '../../utils/definition'
import ButtonWithTooltip from '../Renderers/ButtonWithTooltip'

const HeaderSection = props => {
  const { definition, modalView, changes, renderContributeButton, handleClose, handleSave, handleRevert } = props
  const { item } = definition
  const scores = Definition.computeScores(item)
  return (
    <Row className="row-detail-header">
      <Col md={8}>
        <div className="detail-header">
          <h2>
            {item && item.coordinates.name}
            &nbsp;&nbsp;
            {scores && (
              <span className="score-header">
                <img className="list-buttons" src={getBadgeUrl(scores.tool, scores.effective)} alt="score" />
              </span>
            )}
          </h2>
          <p>{item.coordinates.revision}</p>
        </div>
      </Col>
      <Col md={4} className="text-right">
        {!isEmpty(changes) && (
          <ButtonWithTooltip
            button={
              <Button bsStyle="danger" onClick={() => handleRevert()}>
                <i className="fas fa-undo" />
                <span>&nbsp;Revert Changes</span>
              </Button>
            }
            tip="Revert all changes of the current definition"
          />
        )}{' '}
        {modalView && (
          <Button bsStyle="primary" disabled={isEmpty(changes)} onClick={handleSave}>
            OK
          </Button>
        )}{' '}
        {!modalView && renderContributeButton} {modalView && <Button onClick={handleClose}>Cancel</Button>}
      </Col>
    </Row>
  )
}

export default HeaderSection
