// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'

import FullDetailComponent from './FullDetailComponent'

class FullDetailModal extends Component {
  constructor(props) {
    super(props)
  }

  handleSave = () => {}

  handleClose = () => {
    const { onClose } = this.props
    onClose()
  }

  render() {
    const { visible } = this.props

    return (
      <Modal
        centered
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleSave}
        onCancel={this.handleClose}
        width={'85%'}
      >
        <FullDetailComponent />
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    )
  }
}

FullDetailModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default FullDetailModal
