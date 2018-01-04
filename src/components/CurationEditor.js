// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap'
import { FieldGroup } from './'
import MonacoEditor from 'react-monaco-editor'

export default class CurationEditor extends Component {

  static propTypes = {
    proposeHandler: PropTypes.func.isRequired,
    currentSpec: PropTypes.string,
    proposedSpec: PropTypes.string
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props)
    this.state = { current: props.currentSpec || '', proposed: props.proposedSpec || props.currentSpec || '' }
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
  }

  okHandler(e) {
    const { editor } = this.state
    const text = editor.model.getValue()
    this.props.proposeHandler(text)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  editorDidMount(editor, monaco) {
    this.setState({ ...this.state, editor: editor })
    editor.focus()
  }

  render() {
    const { current, proposed, description } = this.state
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <div>
        <Row>
          <h3>Create a curation for a component</h3>
          <Col sm={6}>
            <MonacoEditor
              height='400'
              language='yaml'
              theme='vs-dark'
              value={current}
              options={options}
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
            />
          </Col>
          <Col sm={6}>
            <MonacoEditor
              height='400'
              language='yaml'
              theme='vs-dark'
              value={proposed}
              options={options}
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
            />
            <FieldGroup
              name="description"
              type="text"
              label="Description"
              value={description || ""}
              onChange={this.handleChange}
              placeholder="Description of your changes"
              maxLength={100}
            />
            <Button className='pull-right' type='button' onClick={this.okHandler}>
              Propose
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}
