// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { Tag } from 'antd'
import { withResize } from '../../../utils/WindowProvider'
import Curation from '../../../utils/curation'
import ScoreRenderer from '../Ui/ScoreRenderer'
import DefinitionTitle from '../Ui/DefinitionTitle'
import DefinitionRevision from '../Ui/DefinitionRevision'
// import ComponentDetailsButtons from '../Ui/ComponentDetailsButtons'
import HarvestIndicator from '../Ui/HarvestIndicator'

class HeaderSection extends Component {
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
      curations,
      definition,
      component
    } = this.props
    const { item } = definition
    const scores = get(item, 'scores')
    const isCurated = Curation.isCurated(curations.item, item)
    const hasPendingCurations = Curation.isPending(curations.item)

    return (
      <>
        <div className="d-flex align-items-center">
          <h2>
            <DefinitionTitle definition={item} showNamespace={false} component={component} />
          </h2>
          {scores && <ScoreRenderer scores={scores} definition={item} />}
        </div>
        <div className="pkg-ver">
          <DefinitionRevision definition={item} showNamespace={false} component={component} />
        </div>
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
        <HarvestIndicator tools={get(item, 'described.tools')} />
        {/* 
        <Row className="row-detail-header">
          <Col md={8}>
            <div className="detail-header">
              <div className="header-title">
                <h2>
                  <DefinitionTitle definition={item} showNamespace={false} />
                </h2>
                <div>
                  <ComponentDetailsButtons item={item} />
                </div>
              </div>
              <DefinitionRevision definition={item} showNamespace={false} />
            </div>
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
              <HarvestIndicator tools={get(item, 'described.tools')} />
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
            {!modalView && !isMobile && renderContributeButton}{' '}
            {modalView && (
              <Button data-test-id="header-section-cancel-button" onClick={handleClose}>
                Cancel
              </Button>
            )}
          </Col>
        </Row> */}
      </>
    )
  }
}

export default withResize(HeaderSection)
