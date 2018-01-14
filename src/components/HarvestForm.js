// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap'
import { MonacoEditorWrapper, Section } from './'
import yaml from 'js-yaml'

export default class HarvestForm extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.editorDidMount = this.editorDidMount.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
  }

  static propTypes = {
    harvestHandler: PropTypes.func.isRequired,
    template: PropTypes.string
  }

  static defaultProps = {
    template: '[\n  { type: npm, url: cd:/npm/npmjs/namespace/name/revision }\n]'
  }

  okHandler(e) {
    const specString = this.state.editor.model.getValue()
    const spec = yaml.safeLoad(specString)
    if (spec)
      this.props.harvestHandler(spec)
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
    const { template } = this.props
    const options = {
      selectOnLineNumbers: true
    }
    const actionButton =
      <Button className='pull-right' bsStyle='success' type='button' onClick={this.okHandler}>
        Queue
      </Button>
    return (
      <Section name={'Queue some components to be harvested'} actionButton={actionButton}>
        <MonacoEditorWrapper
          height='400'
          language='yaml'
          value={template}
          options={options}
          onChange={this.onChange}
          editorDidMount={this.editorDidMount}
        />
      </Section >
    )
  }
}
