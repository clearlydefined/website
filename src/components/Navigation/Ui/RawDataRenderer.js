// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaceholderRenderer from './PlaceholderRenderer'
import MonacoEditorWrapper from '../../MonacoEditorWrapper'

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
    if (value.isFetching) return <PlaceholderRenderer message={`Loading the ${name}`} />
    if (value.error && value.error.state !== 404)
      return <PlaceholderRenderer message={`There was a problem loading the ${name}`} />
    if (!value.isFetched)
      return <PlaceholderRenderer message={'Search for some part of a component name to see details'} />
    if (!value.item) return <PlaceholderRenderer message={`There are no ${name}`} />
    const options = {
      selectOnLineNumbers: true
    }
    return (
      <MonacoEditorWrapper
        height="400"
        language={type}
        value={value.transformed}
        options={options}
        editorDidMount={this.editorDidMount}
      />
    )
  }
}
