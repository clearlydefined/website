// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'
import { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation } from '../../actions/ui'
import { curateAction } from '../../actions/curationActions'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'
import EntitySpec from '../../utils/entitySpec'
import Contribution from '../../utils/contribution'
import ContributePrompt from '../ContributePrompt'
import FullDetailComponent from './FullDetailComponent'

/**
 * Component that renders the Full Detail View as a Page or as a Modal
 * based on modalView property
 */
export class FullDetailPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changes: {}
    }
    this.handleNewSpec = this.handleNewSpec.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getValue = this.getValue.bind(this)
    this.classIfDifferent = this.classIfDifferent.bind(this)
  }

  static propTypes = {
    // Define if the visualization should be as a Modal or as a Page
    modalView: PropTypes.bool,
    // To be used together with `modalView` property: if true, set the Modal as visible
    visible: PropTypes.bool,
    // Callback function callable when data needs to be saved
    onSave: PropTypes.func,
    // Callback function callable when the modal has been closed
    onClose: PropTypes.func,
    // If `modalView` is set to true, than path MUST be passed, otherwise it will be catched from the URL
    path: PropTypes.string
  }

  componentDidMount() {
    const { path, uiNavigation, component } = this.props
    if (path && component) this.handleNewSpec(component)
    uiNavigation({ to: ROUTE_DEFINITIONS })
  }

  componentWillReceiveProps(nextProps) {
    const { path, component } = nextProps
    if (path && path !== this.props.path) this.handleNewSpec(component)
  }

  // Get the data for the current definition
  handleNewSpec(component) {
    const { token, uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested } = this.props
    if (component) {
      uiInspectGetDefinition(token, component)
      uiInspectGetCuration(token, component)
      uiInspectGetHarvested(token, component)
    }
  }

  // Dispatch the action to save a contribution
  doContribute(description) {
    const { token, component } = this.props
    const patches = Contribution.buildContributeSpec({}, component)
    const spec = { description: description, patches }
    curateAction(token, spec)
  }

  // Shows the Modal to save a Contribution
  doPromptContribute() {
    const { component } = this.props
    if (!Contribution.hasChange(component)) return
    this.refs.contributeModal.open()
  }

  handleSave(changes) {
    const { onSave, component } = this.props
    const newComponent = { ...component, changes }
    onSave && onSave(component, newComponent)
  }

  handleClose() {
    const { onClose } = this.props
    onClose()
    this.setState({ visible: false })
  }

  // Function called when a data has been changed
  onChange(item, value) {
    const { component } = this.props
    const { changes } = this.state
    this.setState({ changes: Contribution.onChange(component, changes, item, value) }, () =>
      console.log(this.state.changes)
    )
  }

  getValue(field) {
    const { component } = this.props
    const { changes } = this.state
    return Contribution.getValue(component, changes, field)
  }

  classIfDifferent(field, className) {
    const { component } = this.props
    const { changes } = this.state
    return Contribution.classIfDifferent(component, changes, field, className)
  }

  render() {
    const { path, component, definition, curation, harvest, modalView, visible } = this.props
    const { changes } = this.state

    return modalView ? (
      <Modal
        closable={false}
        // no need for default buttons
        footer={null}
        centered
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleSave}
        onCancel={this.handleClose}
        width={'85%'}
        className="fullDetaiView__modal"
      >
        <FullDetailComponent
          changes={changes}
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          modalView={modalView}
          onChange={this.onChange}
          getValue={this.getValue}
          handleClose={this.handleClose}
          classIfDifferent={this.classIfDifferent}
        />
      </Modal>
    ) : (
      <Grid>
        <FullDetailComponent
          changes={changes}
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          modalView={false}
          onChange={this.onChange}
          getValue={this.getValue}
          classIfDifferent={this.classIfDifferent}
          renderContributeButton={
            <Button bsStyle="success" disabled={!Contribution.hasChange(component)} onClick={this.doPromptContribute}>
              Contribute
            </Button>
          }
        />
        <ContributePrompt ref="contributeModal" actionHandler={this.doContribute} />
      </Grid>
    )
  }
}

function mapStateToProps(state, props) {
  const path = props.path
    ? props.path
    : props.location
      ? props.location.pathname.slice(props.match.url.length + 1)
      : null
  const component = path ? EntitySpec.fromPath(path) : null

  return {
    path,
    component,
    filterValue: state.ui.inspect.filter,
    token: state.session.token,
    definition: state.ui.inspect.definition,
    curation: state.ui.inspect.curation,
    harvest: state.ui.inspect.harvested
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation, curateAction },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
