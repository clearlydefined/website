// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'

export default class ContributePrompt extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false }
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
    this.close = this.close.bind(this)
  }

  static propTypes = {
    actionHandler: PropTypes.func.isRequired
  }

  open() {
    this.setState({ show: true, description: '' })
  }

  close() {
    this.setState({ show: false })
  }

  okHandler(e) {
    this.close()
    const { description } = this.state
    this.props.actionHandler(description)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  render() {
    const { description, show } = this.state
    return (
      <Modal show={show} onHide={this.close}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Describe the changes in this curation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FieldGroup
              name="description"
              type="text"
              label="Description"
              value={description || ''}
              onChange={this.handleChange}
              placeholder="Short description of changes. Like a commit message..."
              maxLength={100}
              componentClass="textarea"
              rows="10"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="success" type="button" onClick={this.okHandler}>
              OK
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
