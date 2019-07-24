// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Button } from 'react-bootstrap'
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
      session,
      inspectedCuration
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
          />
        )}
      </Modal>
    ) : (
      <Grid>
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
          renderContributeButton={
            <Button
              bsStyle="success"
              disabled={isEmpty(changes) || isEmpty(harvest.item)}
              onClick={this.doPromptContribute}
            >
              Contribute
            </Button>
          }
        />
        <ContributePrompt
          ref={this.contributeModal}
          session={session}
          onLogin={this.handleLogin}
          actionHandler={this.doContribute}
          definitions={get(definition, 'item.coordinates') ? [get(definition, 'item.coordinates')] : []}
        />
      </Grid>
    )
  }
}

export default AbstractFullDetailsView
