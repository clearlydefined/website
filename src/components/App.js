// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Header, Footer, NotificationList } from './'

export default class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div className="App">
        <Header />
        <main>{children}</main>
        <Footer />
        <NotificationList />
      </div>
    )
  }
}
