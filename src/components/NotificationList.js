// Copyright (c) 2017, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AlertList } from 'react-bs-notifier'
import { uiNotificationDelete } from '../actions/ui'

class NotificationList extends Component {

  static propTypes = {
    notifications: PropTypes.array,
    position: PropTypes.string
  }

  static defaultProps = {
    notifications: [],
    position: 'top-right'
  }

  constructor(props) {
    super(props)
    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss(message) {
    this.props.dispatch(uiNotificationDelete(message))
  }

  render() {
    const { position, notifications } = this.props
    return (
      <div>
        <AlertList
          position={ position }
          alerts={ notifications }
          onDismiss={ this.onDismiss }
          />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  notifications: state.ui.notifications
})

export default connect(mapStateToProps)(NotificationList)
