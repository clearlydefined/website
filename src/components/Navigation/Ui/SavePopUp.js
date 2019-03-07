// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ControlLabel, Modal, FormGroup, FormControl, Button } from 'react-bootstrap'
import DropFileOrText from './DropFileOrText'

const titles = {
  file: 'Share coordinates as a file',
  notice: 'Share definitions as a Notice file'
}

const extensions = {
  json: '.json',
  text: '.txt',
  html: '.html'
}

export default class SavePopUp extends Component {
  static propTypes = {
    onOK: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    onHide: PropTypes.func,
    show: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.templateInputRef = React.createRef()
    this.state = { renderer: 'text', template: defaultNoticeTemplate }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type === nextProps.type) return
    const filename = nextProps.type === 'notice' ? 'NOTICE' : ''
    this.setState({ ...this.state, filename })
  }

  doOK = () => {
    let { filename, renderer, template } = this.state
    let options = {}
    switch (this.props.type) {
      case 'file':
      case 'notice':
        filename = this.ensureExtension(filename, extensions[renderer])
        if (renderer === 'template') options.template = template
        break
      default:
    }
    this.props.onOK({ filename, renderer, options })
  }

  ensureExtension(name, extension) {
    if (!extension) return name
    return name.toLowerCase().endsWith(extension) ? name : name + extension
  }

  onTemplate = template => {
    const textarea = ReactDOM.findDOMNode(this.templateInputRef.current)
    if (textarea) textarea.value = template
    this.setState({ ...this.state, template })
  }

  renderNoticeForm = () => {
    return (
      <div>
        {this.renderFileForm()}
        <FormGroup controlId="formNoticeOptions">
          <ControlLabel>Renderer</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="renderer"
            onChange={e => this.setState({ ...this.state, renderer: e.target.value })}
            defaultValue={this.state.renderer}
          >
            <option value="text">text</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="template">template</option>
          </FormControl>
          {this.state.renderer === 'template' && (
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Template</ControlLabel>
              <DropFileOrText onLoad={this.onTemplate}>
                <FormControl
                  ref={this.templateInputRef}
                  componentClass="textarea"
                  placeholder="Provide a Handlebars template (see https://handlebarsjs.com). Paste the template text or drag and drop a template file here."
                  onChange={e => this.setState({ ...this.state, template: e.target.value })}
                  defaultValue={this.state.template}
                  rows="6"
                />
              </DropFileOrText>
            </FormGroup>
          )}
        </FormGroup>
      </div>
    )
  }

  renderFileForm = () => {
    return (
      <FormGroup controlId="formFilename">
        <ControlLabel>File name</ControlLabel>
        <FormControl
          type="text"
          placeholder="Enter a name for the file to share"
          onChange={e => this.setState({ ...this.state, filename: e.target.value })}
          defaultValue={this.state.filename}
        />
      </FormGroup>
    )
  }

  enableOK = () => this.state.filename && (this.state.renderer !== 'template' || this.state.template)

  render() {
    const { show, type, onHide } = this.props
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{titles[type] || titles['file']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === 'file' && this.renderFileForm()}
          {type === 'notice' && this.renderNoticeForm()}
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button bsStyle="success" disabled={!this.enableOK()} type="button" onClick={() => this.doOK()}>
                OK
              </Button>
              <Button onClick={onHide}>Cancel</Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

const defaultNoticeTemplate =
  'SOFTWARE NOTICES AND INFORMATION\n\nDo Not Translate or Localize\n\nThis software incorporates material from third parties.\nNotwithstanding any other terms, you may reverse engineer this software to the extent\nrequired to debug changes to any libraries licensed under the GNU Lesser General Public License.\n\n{{#buckets}}\n{{#packages}}\n\n-------------------------------------------------------------------\n\n{{{name}}} {{{version}}} - {{{../name}}}\n{{#if website}}\n{{{website}}}\n{{/if}}\n{{#if copyrights}}\n{{#copyrights}}\n{{{this}}}\n{{/copyrights}}\n{{/if}}\n\n{{{../text}}}\n\n-------------------------------------------------------------------\n{{/packages}}\n{{/buckets}}\n'
