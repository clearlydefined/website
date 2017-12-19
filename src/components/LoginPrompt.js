// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'

export default class LoginPrompt extends Component {

  constructor(props) {
    super(props)
    this.state = { show: false }
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
  }

  static propTypes = {
    loginHandler: PropTypes.func.isRequired
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
    const { username, password } = this.state
    this.props.loginHandler(username, password)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  render() {
    const { username, password } = this.state;
    return (
      <Modal show={this.state.show} onHide={this.close}>
        <Form>
          <h5>Login and explore ClearlyDefined</h5>
          <FieldGroup
            name="username"
            type="text"
            label="Username"
            value={username || ""}
            onChange={this.handleChange}
            placeholder="Your username"
            maxLength={20}
          />
          <FieldGroup
            name="password"
            type="password"
            label="Password"
            value={password || ""}
            onChange={this.handleChange}
            placeholder="Your password"
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
