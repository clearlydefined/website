// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ROUTE_DISCORD } from '../utils/routingConstants'
import { uiNavigation } from '../actions/ui'

class PageDiscord extends Component {
  componentDidMount() {
    this.props.dispatch(uiNavigation({ to: ROUTE_DISCORD }))
  }

  render() {
    window.location.replace('https://discord.gg/wEzHJku');
    return
  }
}

export default connect()(PageDiscord)
