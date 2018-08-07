// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Grid } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'
import { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation } from '../../actions/ui'
import EntitySpec from '../../utils/entitySpec'
import { ROUTE_DEFINITIONS } from '../../utils/routingConstants'

import FullDetailComponent from './FullDetailComponent'

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

  handleNewSpec(newFilter) {
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
        <FullDetailComponent
          curation={curation}
          definition={definition}
          harvest={harvest}
          path={path}
          modalView={modalView}
        />
      </Modal>
    ) : (
        <Grid>
          <FullDetailComponent
            curation={curation}
            definition={definition}
            harvest={harvest}
            path={path}
            modalView={modalView}
          />
        </Grid>
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
    { uiInspectGetDefinition, uiInspectGetCuration, uiInspectGetHarvested, uiNavigation },
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
