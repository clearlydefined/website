// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'
import { FieldGroup } from './'
import { MonacoDiffEditor } from 'react-monaco-editor'

export default class CurationEditor extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.editorDidMount = this.editorDidMount.bind(this)
  }

  static propTypes = {
    currentCuration: PropTypes.string,
    newCuration: PropTypes.string,
    currentPackage: PropTypes.string,
    newPackage: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
  }

  editorDidMount(editor, monaco) {
    // this.setState({ ...this.state, editor: editor })
    // editor.focus()
  }

  render() {
    const { currentCuration, newCuration, currentPackage, newPackage, onChange } = this.props
    const options = {
      selectOnLineNumbers: true,
      renderSideBySide: true
    };
    const requireConfig = { baseUrl: '/', paths: { vs: 'vs' }, url: '/vs/loader.js' };
    return (
      <div>
        <h3>Curations</h3>
        <Row>
          <Col sm={6}>
            <h4>Current</h4>
          </Col>
          <Col sm={6}>
            <h4>Proposed</h4>
          </Col>
        </Row>

        <MonacoDiffEditor
          height='400'
          theme='vs-dark'
          language='yaml'
          original={currentCuration}
          value={newCuration}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
          requireConfig={requireConfig}
        />
        <h3>Effective results</h3>
        <Row>
          <Col sm={6}>
            <h4>Current</h4>
          </Col>
          <Col sm={6}>
            <h4>Proposed</h4>
          </Col>
        </Row>
        <MonacoDiffEditor
          height='400'
          theme='vs-dark'
          language='yaml'
          original={currentPackage}
          value={newPackage}
          options={options}
          onChange={onChange}
          editorDidMount={this.editorDidMount}
          requireConfig={requireConfig}
        />
      </div>
    )
  }
}
