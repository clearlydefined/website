// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import {
  uiInspectGetCuration,
  uiInspectGetHarvested,
  uiInspectGetDefinition,
  uiInspectUpdateFilterList
} from '../actions/ui'
import { getDefinitionsAction } from '../actions/definitionActions'
import { uiNavigation, uiInspectUpdateFilter } from '../actions/ui'
import { FilterBar, MonacoEditorWrapper, Section, CopyUrlButton, DefinitionDetails } from './'
import EntitySpec from '../utils/entitySpec'
import { ROUTE_INSPECT, ROUTE_CURATE } from '../utils/routingConstants'

export class PageInspect extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.editorDidMount = this.editorDidMount.bind(this)
    this.addCuration = this.addCuration.bind(this)
  }

  componentDidMount() {
    const { dispatch, definitions, spec, path, token } = this.props
    !definitions.entries[path] && dispatch(getDefinitionsAction(token, [path]))
    dispatch(uiInspectGetCuration(token, spec))
    dispatch(uiInspectGetHarvested(token, spec))
    dispatch(uiNavigation({ to: ROUTE_INSPECT }))
  }

  addCuration() {
    const url = `${ROUTE_CURATE}/${this.props.filterValue}`
    this.props.history.push(url)
  }

  editorDidMount(editor, monaco) {
    this.setState({ ...this.state, editor: editor })
    editor.focus()
  }

  renderCurationButton() {
    return (
      <Button
        bsStyle="success"
        className="pull-right add-curation-btn"
        disabled={!Boolean(this.props.filterValue)}
        onClick={this.addCuration}
      >
        Add curation
      </Button>
    )
  }

  render() {
    const { definition } = this.props
    if (!definition) return null

    return (
      <Grid className="main-container">
        <Row className="show-grid spacer">
          <DefinitionDetails definition={definition} component={{ ...definition.coordinates }} />
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const path = ownProps.location.pathname.slice(ownProps.match.url.length + 1)
  return {
    token: state.session.token,
    path,
    spec: EntitySpec.fromPath(path),
    definition: state.definition.bodies.entries[path],
    definitions: state.definition.bodies
  }
}
export default connect(mapStateToProps)(PageInspect)
