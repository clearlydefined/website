// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import { Tag } from 'antd'
import { getBadgeUrl } from '../../../api/clearlyDefined'
import Definition from '../../../utils/definition'
import ButtonWithTooltip from '../Ui/ButtonWithTooltip'

export default class HeaderSection extends Component {
  static propTypes = {
    definition: PropTypes.object,
    // If modalView = true, show Save Button, otherwise show a Contribute Button
    modalView: PropTypes.bool,
    changes: PropTypes.object,
    renderContributeButton: PropTypes.element,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
    handleRevert: PropTypes.func
  }

  render() {
    const { definition, modalView, changes, renderContributeButton, handleClose, handleSave, handleRevert } = this.props
    const { item } = definition
    const scores = Definition.computeScores(item)
    const isCurated = Definition.isCurated(item)
    const hasPendingCurations = Definition.hasPendingCurations(item)
    return (
      <Row className="row-detail-header">
        <Col md={8}>
          <div className="detail-header">
            <div className="header-title">
              <h2>{item && item.coordinates.name}</h2>
              &nbsp;&nbsp;
              <div className="header-data">
                {scores && (
                  <span className="score-header">
                    <img className="list-buttons" src={getBadgeUrl(scores.tool, scores.effective)} alt="score" />
                  </span>
                )}
                {isCurated && <Tag color="green">Curated</Tag>}
                {hasPendingCurations && <Tag color="gold">Pending Curations</Tag>}
              </div>
            </div>
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
}
