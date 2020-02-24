// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import get from 'lodash/get'
import omitBy from 'lodash/omitBy'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import notification from 'antd/lib/notification'
import {
  uiInspectGetDefinition,
  uiInspectGetCurations,
  uiInspectGetHarvested,
  uiCurateGetDefinitionPreview,
  uiCurateResetDefinitionPreview,
  uiGetCurationsList,
  uiRevert,
  uiApplyCurationSuggestion,
  uiGetCurationData
} from '../../actions/ui'
import { getDefinitionSuggestedDataAction } from '../../actions/definitionActions'
import { curateAction } from '../../actions/curationActions'
import { login } from '../../actions/sessionActions'
import Contribution from '../../utils/contribution'
import Definition from '../../utils/definition'
import Auth from '../../utils/auth'
import NotificationButtons from '../Navigation/Ui/NotificationButtons'
import { AbstractFullDetailsView } from './AbstractFullDetailsView'
import { withResize } from '../../utils/WindowProvider'
import EntitySpec from '../../utils/entitySpec'

export class FullDetailPage extends AbstractFullDetailsView {
  static defaultProps = {
    readOnly: false
  }

  constructor(props) {
    super(props)
    this.state = {
      changes: {},
      appliedSuggestions: [],
      sequence: 0
    }
    this.handleNewSpec = this.handleNewSpec.bind(this)
    this.doContribute = this.doContribute.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.doPromptContribute = this.doPromptContribute.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleRevert = this.handleRevert.bind(this)
    this.onChange = this.onChange.bind(this)
    this.close = this.close.bind(this)
    this.applyCurationSuggestion = this.applyCurationSuggestion.bind(this)
    this.getCurationData = this.getCurationData.bind(this)
    this.contributeModal = React.createRef()
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
    path: PropTypes.string,
    readOnly: PropTypes.bool
  }

  componentDidMount() {
    const { component } = this.props
    if (component.changes) {
      this.setState({ changes: component.changes }, () => this.handleNewSpec(component))
    } else {
      this.handleNewSpec(component)
    }
  }

  // Get the data for the current definition
  handleNewSpec(component) {
    const {
      token,
      uiInspectGetDefinition,
      uiInspectGetCurations,
      uiInspectGetHarvested,
      getDefinitionSuggestedDataAction
    } = this.props
    if (!component) return
    uiInspectGetDefinition(token, component)
    uiInspectGetCurations(token, component)
    uiInspectGetHarvested(token, component)
    getDefinitionSuggestedDataAction(token, component)
    //uiGetCurationsList(token, component)
    this.previewDefinition(component)
  }

  /**
   * Dispatch the action to save a contribution
   * @param  {} contributionInfo object that describes the contribution
   */
  doContribute(contributionInfo) {
    const { token, component, definition, curateAction } = this.props
    // Make sure the right casing is used to create a curation:
    const coordinates = get(definition, 'item.coordinates')
    const casedComponent = coordinates ? EntitySpec.fromObject(coordinates) : undefined
    const { changes } = this.state
    const patches = Contribution.buildContributeSpec([], casedComponent || component, changes)
    const spec = { contributionInfo, patches }
    curateAction(token, spec)
  }

  // Action that calls the remote API that return a preview of the definition
  previewDefinition(nextComponent) {
    const { token, component, uiCurateGetDefinitionPreview, uiCurateResetDefinitionPreview } = this.props
    const { changes } = this.state
    if (
      (!component || isEmpty(component.changes)) &&
      (!nextComponent || isEmpty(nextComponent.changes)) &&
      isEmpty(changes)
    )
      return uiCurateResetDefinitionPreview()
    const previewComponent = nextComponent ? nextComponent : component
    const patch = Contribution.buildPatch([], previewComponent, changes)
    const cleanPatch = this.cleanPatch(patch, 'facets')
    !isEmpty(cleanPatch)
      ? uiCurateGetDefinitionPreview(token, previewComponent, cleanPatch)
      : uiCurateResetDefinitionPreview()
  }

  // remove empty arrays from described.facets to workaround issue on Service API
  // https://github.com/clearlydefined/service/issues/456
  cleanPatch(patch, key) {
    const { described } = patch
    if (!described || !described[key]) return patch
    const cleanPatch = { ...patch, described: { ...described, [key]: {} } }
    for (const s in described[key]) {
      const elem = described[key][s]
      if (elem.length) cleanPatch.described[key][s] = elem
    }
    if (Object.keys(cleanPatch.described[key]).length === 0) {
      delete cleanPatch.described[key]
    }
    return cleanPatch
  }

  // Shows the Modal to save a Contribution
  doPromptContribute() {
    const { changes } = this.state
    if (isEmpty(changes)) return
    this.contributeModal.current.open()
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
    const { onClose } = this.props
    const { changes } = this.state
    if (isEmpty(changes)) return onClose()
    const key = `open${Date.now()}`
    notification.open({
      message: 'Unsaved Changes',
      description: 'Some information has been changed and is currently unsaved. Are you sure you want to continue?',
      btn: (
        <NotificationButtons
          onClick={() => {
            this.close()
            notification.close(key)
          }}
          onClose={() => notification.close(key)}
          confirmText="OK"
          dismissText="Cancel"
        />
      ),
      key,
      onClose: notification.close(key),
      duration: 0
    })
  }

  handleRevert(value) {
    const { uiCurateResetDefinitionPreview } = this.props
    const { changes } = this.state
    if (isEmpty(changes)) return
    if (value) {
      const revertedChanges = omitBy(changes, (_, index) => index.startsWith(value))
      this.setState({ changes: revertedChanges, sequence: this.state.sequence + 1 }, () => this.previewDefinition())
      return
    }
    const key = `open${Date.now()}`
    notification.open({
      message: 'Confirm Revert?',
      description: 'Are you sure to revert all the unsaved changes from the current definition?',
      btn: (
        <NotificationButtons
          onClick={() =>
            this.setState({ changes: {} }, () => {
              uiCurateResetDefinitionPreview()
              notification.close(key)
            })
          }
          onClose={() => notification.close(key)}
          confirmText="OK"
          dismissText="Cancel"
        />
      ),
      key,
      onClose: () => notification.close(key),
      duration: 0
    })
  }

  handleSuggestions() {
    const key = `open${Date.now()}`
    notification.open({
      description:
        'Another version of this defition has some recently updated data. \n \n Take a look at them and decide if to keep each data or discard it.',
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

  handleLogin(e) {
    e.preventDefault()
    Auth.doLogin((token, permissions, username, publicEmails) => {
      this.props.login(token, permissions, username, publicEmails)
    })
  }

  applyCurationSuggestion(suggestion) {
    const { appliedSuggestions } = this.state
    appliedSuggestions.push(suggestion)
    this.setState({ appliedSuggestions })
  }

  getCurationData(prNumber) {
    const { uiGetCurationData, component, token } = this.props
    uiGetCurationData(token, component, prNumber)
  }
}

function mapStateToProps(state, props) {
  const { currentDefinition } = props
  const path = Definition.getPathFromUrl(props)
  const component = props.component || Definition.getDefinitionEntity(path)
  const curations = state.ui.inspect.curations && cloneDeep(state.ui.inspect.curations)
  let previewDefinition, definition
  if (currentDefinition && currentDefinition.otherDefinition) {
    previewDefinition = Contribution.getChangesFromPreview(currentDefinition.otherDefinition, currentDefinition)
    definition = { ...state.ui.inspect.definition, item: currentDefinition.otherDefinition }
  } else {
    previewDefinition = Definition.getDefinitionPreview(state)
    definition = state.ui.inspect.definition && cloneDeep(state.ui.inspect.definition)
  }

  return {
    path,
    component,
    filterValue: state.ui.inspect.filter && cloneDeep(state.ui.inspect.filter),
    token: state.session.token,
    session: state.session,
    definition,
    curations,
    harvest: state.ui.inspect.harvested && cloneDeep(state.ui.inspect.harvested),
    previewDefinition,
    inspectedCuration: state.ui.inspect.inspectedCuration && cloneDeep(state.ui.inspect.inspectedCuration)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      uiInspectGetDefinition,
      uiInspectGetCurations,
      uiInspectGetHarvested,
      uiGetCurationsList,
      curateAction,
      uiCurateGetDefinitionPreview,
      uiCurateResetDefinitionPreview,
      uiRevert,
      uiApplyCurationSuggestion,
      uiGetCurationData,
      getDefinitionSuggestedDataAction
    },
    dispatch
  )
}

export default withResize(connect(mapStateToProps, mapDispatchToProps)(FullDetailPage))
