// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { Tag } from 'antd'
import Curation from '../../../utils/curation'
import ScoreRenderer from '../Ui/ScoreRenderer'
import DefinitionTitle from '../Ui/DefinitionTitle'
import DefinitionRevision from '../Ui/DefinitionRevision'

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
    const {
      definition,
      curations,
      modalView,
      changes,
      renderContributeButton,
      handleClose,
      handleSave,
      handleRevert
    } = this.props
    const { item } = definition
    const scores = get(item, 'scores')
    const isCurated = Curation.isCurated(curations.item)
    const hasPendingCurations = Curation.isPending(curations.item)
    return (
      <Row className="row-detail-header">
        <Col md={8}>
          <div className="detail-header">
            <div className="header-title">
              <h2>
                <DefinitionTitle definition={item} showNamespace={false} />
              </h2>
              &nbsp;&nbsp;
              <div className="header-data">
                {scores && (
                  <span className="score-header">
                    <ScoreRenderer scores={scores} definition={item} />
                  </span>
                )}
                {isCurated && (
                  <Tag className="cd-badge" color="purple">
                    Curated
                  </Tag>
                )}
                {hasPendingCurations && (
                  <Tag className="cd-badge" color="green">
                    Pending curations
                  </Tag>
                )}
              </div>
            </div>
            <p>
              <DefinitionRevision definition={item} showNamespace={false} />
            </p>
          </div>
        </Col>
        <Col md={4} className="text-right">
          {!isEmpty(changes) && (
            <Button bsStyle="danger" data-test-id="header-section-revert-button" onClick={() => handleRevert()}>
              <i className="fas fa-undo" />
              <span>&nbsp;Revert Changes</span>
            </Button>
          )}{' '}
          {modalView && (
            <Button
              bsStyle="success"
              data-test-id="header-section-ok-button"
              disabled={isEmpty(changes)}
              onClick={handleSave}
            >
              OK
            </Button>
          )}{' '}
          {!modalView && renderContributeButton}{' '}
          {modalView && (
            <Button data-test-id="header-section-cancel-button" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </Col>
      </Row>
    )
  }
}
