// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap'
import { MonacoDiffEditor } from 'react-monaco-editor'
import extend from 'extend'
import yaml from 'js-yaml'

export default class CurationReview extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.onChange(props.newCuration)
    this.editorDidMount = this.editorDidMount.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  static propTypes = {
    currentCuration: PropTypes.string,
    newCuration: PropTypes.string,
    currentPackage: PropTypes.string,
    // newPackage: PropTypes.string,
    currentSummary: PropTypes.string
  }

  static defaultProps = {
  }

  editorDidMount(type, editor, monaco) {
    this.setState({ ...this.state, [type]: editor })
    editor.focus()
  }

  onChange(newCuration, event) {
    const newPackage = this.computeProposedPackage(newCuration)
    if (!this.state.result)
      return
    this.state.result.getModifiedEditor().getModel().setValue(newPackage);
  }

  computeProposedPackage(newCuration) {
    const { currentSummary } = this.props
    // TODO figure out how to represent deletions
    try {
      const newValue = yaml.safeLoad(newCuration)
      // const newValue = extend(true, {}, newObject, newCuration)
      return newValue ? yaml.safeDump(newValue).toString() : ''
    } catch (error) {
      return newCuration
    }
  }

  render() {
    const { currentCuration, newCuration, currentPackage } = this.props
    const { newPackage } = this.state
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
          editorDidMount={this.editorDidMount.bind(this, 'curation')}
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
          editorDidMount={this.editorDidMount.bind(this, 'result')}
          requireConfig={requireConfig}
        />
      </div>
    )
  }
}
