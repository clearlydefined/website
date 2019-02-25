// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Header, Footer, NotificationList } from './'
import { WindowProvider } from '../utils/WindowProvider'

export default class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div className="App">
        <WindowProvider>
          <Header />
          <main className="App-content">{children}</main>
          <Footer />
          <NotificationList />
        </WindowProvider>
      </div>
    )
  }
}
