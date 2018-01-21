// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';
import { Header, Footer } from './'

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
      </div>
    )
  }
}
