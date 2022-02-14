// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import Modal from 'antd/lib/modal'
import ContributePrompt from '../ContributePrompt'
import FullDetailComponent from './FullDetailComponent'

/**
 * Component that renders the Full Detail View as a Page or as a Modal
 * based on modalView property
 */
export class AbstractFullDetailsView extends Component {
  render() {
    const {
      path,
      definition,
      curations,
      harvest,
      modalView,
      isMobile,
      visible,
      previewDefinition,
      readOnly,
      inspectedCuration,
      component
    } = this.props
    const { changes } = this.state

    return modalView ? (
      <Modal
        closable={false}
        footer={null}
        // if it's mobile do not center the Modal
        centered={!isMobile}
        destroyOnClose={true}
        visible={visible}
        width={isMobile ? '95%' : '85%'}
        className="fullDetaiView__modal"
      >
        {visible && (
          <FullDetailComponent
            curations={curations}
            definition={definition}
            harvest={harvest}
            path={path}
            readOnly={readOnly}
            modalView={modalView}
            onChange={this.onChange}
            handleClose={this.handleClose}
            handleSave={this.handleSave}
            handleRevert={this.handleRevert}
            previewDefinition={previewDefinition}
            changes={changes}
            applyCurationSuggestion={this.applyCurationSuggestion}
            getCurationData={this.getCurationData}
            inspectedCuration={inspectedCuration}
            component={component}
          />
        )}
      </Modal>
    ) : (
      <>
        <FullDetailComponent
          curations={curations}
          definition={definition}
          harvest={harvest}
          path={path}
          readOnly={readOnly}
          modalView={false}
          onChange={this.onChange}
          changes={changes}
          previewDefinition={previewDefinition}
          handleRevert={this.handleRevert}
          applyCurationSuggestion={this.applyCurationSuggestion}
          getCurationData={this.getCurationData}
          inspectedCuration={inspectedCuration}
          component={component}
          renderContributeButton={
            <div className="d-contents">
              {!isEmpty(changes) && (
                <Button
                  className="revert-btn mr-2"
                  disabled={isEmpty(changes) || isEmpty(harvest.item)}
                  onClick={e => this.handleRevert()}
                >
                  Revert
                </Button>
              )}
              <Button
                className="contribute-btn"
                disabled={isEmpty(changes) || isEmpty(harvest.item)}
                onClick={this.doPromptContribute}
              >
                Contribute
              </Button>
            </div>
          }
        />
        <ContributePrompt
          ref={this.contributeModal}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
          definitions={get(definition, 'item.coordinates') ? [get(definition, 'item.coordinates')] : []}
        />
      </>
    )
  }
}

export default AbstractFullDetailsView
