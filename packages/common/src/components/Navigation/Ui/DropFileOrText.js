// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uiWarning } from '../../../actions/ui'

class DropFileOrText extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onLoad: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
  }

  async onDrop(event) {
    const { dispatch } = this.props
    event.preventDefault()
    event.persist()
    try {
      let result
      if ((result = await this.handleTextDrop(event)) !== false) return result
      if ((result = await this.handleDropFiles(event)) !== false) return result
      const message = 'ClearlyDefined does not understand whatever it is you just dropped'
      uiWarning(dispatch, message)
      return Promise.reject(message)
    } catch (error) {
      uiWarning(dispatch, error.message)
      return Promise.reject(error.message)
    }
  }

  async handleTextDrop(event) {
    const text = event.dataTransfer.getData('Text')
    return text ? this.props.onLoad(text) : false
  }

  async handleDropFiles(event) {
    const files = Object.values(event.dataTransfer.files)
    if (!files || !files.length) return false
    const { dispatch, onLoad } = this.props
    if (files.length > 1) {
      uiWarning(dispatch, 'Only drop one file')
      return false
    }
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => onLoad(reader.result, file.name)
    reader.readAsBinaryString(file)
  }

  render() {
    return (
      <div
        onDragOver={e => e.preventDefault()}
        onDragEnter={e => e.preventDefault()}
        onDrop={this.onDrop}
        style={{ position: 'relative' }}
      >
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { token: state.session.token }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ dispatch }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropFileOrText)
