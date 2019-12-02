// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaceholderRenderer from './PlaceholderRenderer'
import Editor from '@monaco-editor/react';

export default class RawDataRenderer extends Component {
  static propTypes = {
    value: PropTypes.object,
    name: PropTypes.string,
    type: PropTypes.string
  }
  static defaultProps = {
    type: 'json'
  }
  render() {
    const { value, name, type } = this.props
    if (!value) return <PlaceholderRenderer message={`Empty data`} />
    if (value.isFetching) return <PlaceholderRenderer message={`Loading the ${name}`} />
    if (value.error && value.error.status !== 404)
      return <PlaceholderRenderer message={`There was a problem loading the ${name}`} />
    if (!value.isFetched)
      return <PlaceholderRenderer message={'Search for some part of a component name to see details'} />
    if (!value.item) return <PlaceholderRenderer message={`No ${name} found`} />
    const options = {
      selectOnLineNumbers: true,
      cursorSmoothCaretAnimation: true,
      cursorStyle: 'block',
      cursorSurroundingLines: 1,
      mouseWheelZoom: true
    }
    return (
      <Editor
        height="400px"
        language={type}
        value={value.transformed}
        options={options}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}
