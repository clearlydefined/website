// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import set from 'lodash/set'
import find from 'lodash/find'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'
import { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation } from '../../actions/ui'
import EntitySpec from '../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'
import { curateAction } from '../../actions/curationActions'
import ContributePrompt from '../ContributePrompt'

/**
 * Component that renders the Full Detail View as a Page or as a Modal
 * based on modalView property
 *
 */
export class FullDetailPage extends Component {
  componentDidMount() {
    const { path, filterValue, uiNavigation } = this.props

    if (path) {
      const pathToShow = path ? path : filterValue
      this.handleNewSpec(pathToShow)
    }
    uiNavigation({ to: ROUTE_DEFINITIONS })
  }

  componentWillReceiveProps(nextProps) {
    const { path, filterValue } = nextProps

    if (path && path !== this.props.path) {
      const pathToShow = path ? path : filterValue
      this.handleNewSpec(pathToShow)
    }
  }

  /**
   * Get the data for the current definition
   *
   */
  handleNewSpec = newFilter => {
    const { token, uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested } = this.props
    if (!newFilter) {
      // TODO clear out the "current" values as we are not showing anything.
      return
    }
    const spec = EntitySpec.fromPath(newFilter)
    uiInspectGetDefinition(token, spec)
    uiInspectGetCuration(token, spec)
    uiInspectGetHarvested(token, spec)
  }

  /**
   * Check if the current component has listed changes
   *
   */
  hasChange = entry => {
    return entry.changes && Object.getOwnPropertyNames(entry.changes).length
  }

  /**
   * Dispatch the action to save a contribution
   *
   */
  doContribute = description => {
    /*const { token, components } = this.props
    const patches = this.buildContributeSpec(components.list)
    const spec = { description: description, patches }
    curateAction(token, spec)*/
  }

  /**
   * Function that builds the Contribution data for the specific definition
   *
   */
  buildContributeSpec = list => {
    return list.reduce((result, component) => {
      if (!this.hasChange(component)) return result
      const coord = EntitySpec.asRevisionless(component)
      const patch = find(result, p => {
        return EntitySpec.isEquivalent(p.coordinates, coord)
      })
      const revisionNumber = component.revision
      const patchChanges = Object.getOwnPropertyNames(component.changes).reduce((result, change) => {
        set(result, change, component.changes[change])
        return result
      }, {})
      if (patch) {
        patch.revisions[revisionNumber] = patchChanges
      } else {
        const newPatch = { coordinates: coord, revisions: { [revisionNumber]: patchChanges } }
        result.push(newPatch)
      }
      return result
    }, [])
  }

  /**
   * Shows the Modal to save a Contribution
   *
   */
  doPromptContribute = () => {
    if (!this.hasChanges()) return
    this.refs.contributeModal.open()
  }

  handleSave = () => {}

  handleClose = () => {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const { path, definition, curation, harvest, modalView, visible } = this.props
    console.log(path, definition, curation, harvest)
    return modalView ? (
      <Modal
        centered
        destroyOnClose={true}
        visible={visible}
        onOk={() => this.handleSave()}
        onCancel={() => this.handleClose()}
        width={'85%'}
      >
        {path}
      </Modal>
    ) : (
      <div>
        <ContributePrompt ref="contributeModal" actionHandler={this.doContribute} />
        {path}
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    path: props.path ? props.path : props.location ? props.location.pathname.slice(props.match.url.length + 1) : null,
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

FullDetailPage.propTypes = {
  /* Define if the visualization should be as a Modal or as a Page */
  modalView: PropTypes.bool,
  /* To be used together with `modalView` property: if true, set the Modal as visible */
  visible: PropTypes.bool,
  /* Callback function callable when the modal has been closed */
  onClose: PropTypes.bool,
  /* If `modalView` is set to true, than path MUST be passed, otherwise it will be catched from the URL */
  path: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullDetailPage)
