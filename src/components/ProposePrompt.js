// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'

export default class ProposePrompt extends Component {

  constructor(props) {
    super(props)
    this.state = { show: false }
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
  }

  static propTypes = {
    proposeHandler: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  open() {
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false })
  }

  okHandler(e) {
    this.close()
    const { description } = this.state
    this.props.proposeHandler(description)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  render() {
    const { description } = this.state;
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Form>
          <h5>Describe the changes in this curation</h5>
          <FieldGroup
            name="description"
            type="text"
            label="Description"
            value={description || ""}
            onChange={this.handleChange}
            placeholder="Short description of changes. Like a commit message..."
            maxLength={20}
          />
          <Button type="submit" onClick={this.okHandler}>
            OK
          </Button>
        </Form>
      </Modal>
    )
  }
}
