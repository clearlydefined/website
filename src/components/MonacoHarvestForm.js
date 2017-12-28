// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'
import MonacoEditor from 'react-monaco-editor'

export default class HarvestForm extends Component {

  constructor(props) {
    super(props)
    this.state = { spec: "{}"}
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
  }

  static propTypes = {
    harvestHandler: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  okHandler(e) {
    const { editor } = this.state
    const text = editor.model.getValue()
    this.props.harvestHandler(text)
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
    const { spec } = this.state
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <Form>
        <h3>Queue a component to be harvested</h3>
        <MonacoEditor
          width="700"
          height="400"
          language="json"
          theme="vs-dark"
          value={spec}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
        <Button type="submit" onClick={this.okHandler}>
          OK
        </Button>
      </Form>
    )
  }
}
