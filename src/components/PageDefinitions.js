// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import { FilterBar } from './'
import { uiBrowseUpdateList, uiNotificationNew } from '../actions/ui'
import { getDefinitionsAction } from '../actions/definitionActions'
import EntitySpec from '../utils/entitySpec'

import AbstractPageDefinitions from './AbstractPageDefinitions'

class PageDefinitions extends AbstractPageDefinitions {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }

  tableTitle() {
    return 'Available definitions'
  }

  renderSearchBar() {
    const { filterOptions } = this.props
    return (
      <Row className="show-grid spacer">
        <Col md={10} mdOffset={1}>
          <FilterBar options={filterOptions} onChange={this.onAddComponent} onSearch={this.onSearch} clearOnChange />
        </Col>
      </Row>
    )
  }

  renderButtons() {
    return (
      <div className="pull-right">
        <Button bsStyle="danger" disabled={!this.hasComponents()} onClick={this.onRemoveAll}>
          Clear All
        </Button>
        &nbsp;
        <Button bsStyle="default" disabled={!this.hasComponents()} onClick={this.collapseAll}>
          Collapse All
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasComponents()} onClick={this.doSave}>
          Save
        </Button>
        &nbsp;
        <Button bsStyle="success" disabled={!this.hasChanges()} onClick={this.doPromptContribute}>
          Contribute
        </Button>
      </div>
    )
  }

  noRowsRenderer() {
    return <div className="list-noRows">Search for components above ...</div>
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { dispatch, token, definitions } = this.props
    dispatch(uiNotificationNew({ type: 'info', message: 'Loading component list from file(s)', timeout: 5000 }))
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const listSpec = this.loadListSpec(reader.result, file)
        if (typeof listSpec === 'string') {
          const message = `Invalid component list file: ${listSpec}`
          return dispatch(uiNotificationNew({ type: 'info', message, timeout: 5000 }))
        }
        listSpec.coordinates.forEach(component => {
          // TODO figure a way to add these in bulk. One by one will be painful for large lists
          const spec = EntitySpec.validateAndCreate(component)
          if (spec) {
            const path = spec.toPath()
            !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
            dispatch(uiBrowseUpdateList({ add: spec }))
          }
        })
      }
      reader.readAsBinaryString(file)
    })
  }

  dropZone(child) {
    return (
      <Dropzone disableClick onDrop={this.onDrop} style={{ position: 'relative' }}>
        {child}
      </Dropzone>
    )
  }

  readOnly() {
    return false
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.session.token,
    filterValue: state.ui.browse.filter,
    filterOptions: state.ui.browse.filterList,
    components: state.ui.browse.componentList,
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageDefinitions)
