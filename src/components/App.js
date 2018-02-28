// Copyright (c) Microsoft Corporation and Others.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Header, Footer, NotificationList } from './'

export default class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div className="App">
        <Header />
        <main className="App-content">
          {children}
        </main>
        <Footer />
        <NotificationList />
      </div>
    )
  }
}
