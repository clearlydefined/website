// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button } from 'react-bootstrap'

export default class ProposePrompt extends Component {
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
    this.setState({ show: true })
  }

  close() {
    this.setState({ show: false })
  }

  okHandler(e) {
    this.close()
    this.props.actionHandler()
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Form>
          <h5>
            Eventually this will expose a handy workflow for curators to propose changes to upstream projects based on
            the work done in ClearlyDefined.
          </h5>
          <Button type="button" onClick={this.okHandler}>
            OK
          </Button>
        </Form>
      </Modal>
    )
  }
}
