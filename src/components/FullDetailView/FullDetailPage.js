// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid, Button } from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import AntdButton from 'antd/lib/button'
import notification from 'antd/lib/notification'
import 'antd/dist/antd.css'
import {
  uiInspectGetDefinition,
  uiInspectGetCuration,
  uiInspectGetHarvested,
  uiNavigation,
  uiCurateGetDefinitionPreview,
  uiCurateResetDefinitionPreview
} from '../../actions/ui'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'
import { curateAction } from '../../actions/curationActions'
import Contribution from '../../utils/contribution'
import Definition from '../../utils/definition'
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
    this.close = this.close.bind(this)
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
    if (path && path !== this.props.path) {
      if (component.changes) {
        this.setState({ changes: component.changes }, () => this.handleNewSpec(component))
      } else this.handleNewSpec(component)
    }
  }

  // Get the data for the current definition
  handleNewSpec(component) {
    const { token, uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested } = this.props
    if (!component) return false
    uiInspectGetDefinition(token, component)
    uiInspectGetCuration(token, component)
    uiInspectGetHarvested(token, component)
    this.previewDefinition()
  }

  /**
   * Dispatch the action to save a contribution
   * @param  {} description string that describes the contribution
   */
  doContribute(description) {
    const { token, component, curateAction } = this.props
    const patches = Contribution.buildContributeSpec({}, component)
    const spec = { description: description, patches }
    curateAction(token, spec)
  }

  // Action that calls the remote API that return a preview of the definition
  previewDefinition() {
    const { token, component, uiCurateGetDefinitionPreview } = this.props
    const { changes } = this.state
    if (!component) return false

    const patches = Contribution.buildPatch([], component, changes)
    uiCurateGetDefinitionPreview(token, component, patches)
  }

  // Shows the Modal to save a Contribution
  doPromptContribute() {
    const { component } = this.props
    if (!Contribution.hasChange(component)) return
    this.refs.contributeModal.open()
  }

  handleSave() {
    const { onSave, component, uiCurateResetDefinitionPreview } = this.props
    const { changes } = this.state
    const newComponent = { ...component, changes }
    this.setState({ changes: {} }, () => {
      uiCurateResetDefinitionPreview()
      onSave && onSave(component, newComponent)
    })
  }

  handleClose() {
    const { previewDefinition, onClose } = this.props
    if (isEmpty(previewDefinition)) return onClose()
    const key = `open${Date.now()}`
    const btn = (
      <Fragment>
        <AntdButton
          type="primary"
          size="small"
          onClick={() => {
            this.close()
            notification.close(key)
          }}
        >
          Confirm
        </AntdButton>
        <AntdButton type="secondary" size="small" onClick={() => notification.close(key)}>
          Dismiss Notification
        </AntdButton>
      </Fragment>
    )
    notification.open({
      message: 'Unsaved Changes',
      description:
        'Some information have been changed and are currently unsaved. Are you sure to continue without saving?',
      btn,
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  close() {
    const { uiCurateResetDefinitionPreview, onClose } = this.props
    this.setState({ changes: {} }, () => {
      uiCurateResetDefinitionPreview()
      onClose()
    })
  }

  // Function called when a data has been changed
  onChange(item, value, type, transform) {
    const { component } = this.props
    const { changes } = this.state
    this.setState({ changes: Contribution.applyChanges(component, changes, item, value, type, transform) }, () =>
      this.previewDefinition()
    )
  }

  render() {
    const { path, component, definition, curation, harvest, modalView, visible, previewDefinition } = this.props

    return modalView ? (
      <Modal
        closable={false}
        // no need for default buttons
        footer={null}
        centered
        destroyOnClose={true}
        visible={visible}
        width={'85%'}
        className="fullDetaiView__modal"
      >
        {visible ? (
          <FullDetailComponent
            curation={curation}
            definition={definition}
            harvest={harvest}
            path={path}
            readOnly={false}
            modalView={modalView}
            onChange={this.onChange}
            handleClose={this.handleClose}
            handleSave={this.handleSave}
            previewDefinition={previewDefinition}
          />
        ) : null}
      </Modal>
    ) : (
      <Grid>
        <FullDetailComponent
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          readOnly={false}
          modalView={false}
          onChange={this.onChange}
          previewDefinition={previewDefinition}
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
  const path = Definition.getPathFromUrl(props)
  const component = props.component || Definition.getDefinitionEntity(path)
  const previewDefinition = Definition.getDefinitionPreview(state)

  return {
    path,
    component,
    filterValue: state.ui.inspect.filter && cloneDeep(state.ui.inspect.filter),
    token: state.session.token,
    definition: state.ui.inspect.definition && cloneDeep(state.ui.inspect.definition),
    curation: state.ui.inspect.curation && cloneDeep(state.ui.inspect.curation),
    harvest: state.ui.inspect.harvested && cloneDeep(state.ui.inspect.harvested),
    previewDefinition
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      uiInspectGetDefinition,
      uiInspectGetCuration,
      uiInspectGetHarvested,
      uiNavigation,
      curateAction,
      uiCurateGetDefinitionPreview,
      uiCurateResetDefinitionPreview
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
