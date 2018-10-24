import React, { Component, Fragment } from 'react'
import AntdButton from 'antd/lib/button'
import PropTypes from 'prop-types'

class NotificationButtons extends Component {
  static propTypes = {
    // Text to display for the Confirm Button
    confirmText: PropTypes.string,
    // Text to display for the Dismiss Button
    dismissText: PropTypes.string,
    // Callback function callable when data needs to be saved
    onClick: PropTypes.func,
    // Callback function callable when the notifications needs to be closed
    onClose: PropTypes.func
  }
  render() {
    const { onClick, onClose, confirmText, dismissText } = this.props
    return (
      <Fragment>
        <AntdButton type="primary" size="small" onClick={onClick}>
          {confirmText}
        </AntdButton>
        <AntdButton type="secondary" size="small" onClick={onClose}>
          {dismissText}
        </AntdButton>
      </Fragment>
    )
  }
}

export default NotificationButtons
