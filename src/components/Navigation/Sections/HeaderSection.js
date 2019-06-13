// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Button, Col } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { Tag, Dropdown, Menu, Icon } from 'antd'
import { withResize } from '../../../utils/WindowProvider'
import Curation from '../../../utils/curation'
import ScoreRenderer from '../Ui/ScoreRenderer'
import DefinitionTitle from '../Ui/DefinitionTitle'
import DefinitionRevision from '../Ui/DefinitionRevision'
import CopyUrlButton from '../../CopyUrlButton'
import { ROUTE_DEFINITIONS } from '../../../utils/routingConstants'
import EntitySpec from '../../../utils/entitySpec'
import Definition from '../../../utils/definition'
import ButtonWithTooltip from '../Ui/ButtonWithTooltip'

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

  constructor(props) {
    super(props)
    this.copyUrlButton = React.createRef()
  }

  isSourceComponent(component) {
    return ['github', 'sourcearchive'].includes(component.provider)
  }

  openSourceForComponent = definition => {
    const sourceLocation = get(definition, 'described.sourceLocation')
    const sourceEntity = sourceLocation && EntitySpec.fromObject(sourceLocation)
    const path = `${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(sourceEntity).toPath()}`
    window.open(`${window.location.origin}${path}`)
  }

  render() {
    const {
      changes,
      curations,
      definition,
      handleClose,
      handleRevert,
      handleSave,
      isMobile,
      modalView,
      renderContributeButton
    } = this.props
    const { item } = definition
    const scores = get(item, 'scores')
    const isCurated = Curation.isCurated(curations.item)
    const hasPendingCurations = Curation.isPending(curations.item)

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={() => this.copyUrlButton.current.onCopy()}>
          Copy Component Url{' '}
          <CopyUrlButton
            ref={this.copyUrlButton}
            className="list-fa-button"
            path={`${ROUTE_DEFINITIONS}/${EntitySpec.fromObject(get(item, 'coordinates')).toPath()}`}
          />
        </Menu.Item>
        {!isSourceComponent && !isSourceEmpty && (
          <Menu.Item key="2" onClick={() => this.openSourceForComponent(item)}>
            Open Source Definition{' '}
            <ButtonWithTooltip tip="Open the definition for source that matches this package" placement="bottom">
              <Button className="list-fa-button">
                <i className="fas fa-code" />
              </Button>
            </ButtonWithTooltip>
          </Menu.Item>
        )}
        <Menu.Item key="3">
          List other version of this component{' '}
          <Button className="list-fa-button">
            <i class="fas fa-list" />
          </Button>
        </Menu.Item>
      </Menu>
    )

    const isSourceComponent = this.isSourceComponent(item.coordinates)
    const isSourceEmpty = Definition.isSourceEmpty(item)
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
              <div>
                <Dropdown overlay={menu} trigger="hover">
                  <Button bsStyle="info">
                    <i class="fas fa-ellipsis-v" />
                  </Button>
                </Dropdown>
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
          {!modalView && !isMobile && renderContributeButton}{' '}
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

export default withResize(HeaderSection)
