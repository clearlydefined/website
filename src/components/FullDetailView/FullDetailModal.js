import React, { Component } from 'react'
import Modal from 'antd/lib/modal'
import 'antd/dist/antd.css'

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
        onOk={() => this.handleSave()}
        onCancel={() => this.handleClose()}
        width={'85%'}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    )
  }
}

export default FullDetailModal
