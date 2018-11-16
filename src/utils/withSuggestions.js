// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'

export default function withSuggestions(WrappedComponent, options = {}) {
  const HOC = class extends Component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return HOC
}
