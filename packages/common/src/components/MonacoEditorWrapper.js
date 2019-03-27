// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import MonacoEditor from 'react-monaco-editor'

// Wrapper for MonacoEditor to setup the requireConfig to allow proper module loading
export default class MonacoEditorWrapper extends Component {
  render() {
    const requireConfig = { baseUrl: '/', paths: { vs: 'vs' }, url: '/vs/loader.js' }
    return (
      <div className="section-body">
        <MonacoEditor {...this.props} requireConfig={requireConfig} />
      </div>
    )
  }
}
