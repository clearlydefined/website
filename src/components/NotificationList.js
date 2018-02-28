// Copyright (c) 2017, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AlertList } from 'react-bs-notifier'
import { uiNotificationDelete } from '../actions/ui'

class NotificationList extends Component {

  static propTypes = {
    notifications: PropTypes.array
  }

  static defaultProps = {
    notifications: []
  }

  render() {
    const {dispatch} = this.props
    return (
      <div>
        <AlertList
          position="top-right"
          alerts={this.props.notifications}
          timeout={4000}
          onDismiss={message => dispatch(uiNotificationDelete(message))}
          />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  notifications: state.ui.notifications
})

export default connect(mapStateToProps)(NotificationList)
