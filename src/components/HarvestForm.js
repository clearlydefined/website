// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap'
import { FieldGroup } from './'

export default class HarvestForm extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
  }

  static propTypes = {
    harvestHandler: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  okHandler(e) {
    const { spec } = this.state
    this.props.harvestHandler(spec)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  render() {
    const { spec } = this.state
    return (
      <Form>
        <h3>Queue a component to be harvested</h3>
        <FieldGroup
          name="spec"
          componentClass="textarea"
          label="Description"
          rows="5"
          value={spec || ""}
          placeholder="A description of the component to harvest"
          onChange={this.handleChange}
        />
        <Button type="submit" onClick={this.okHandler}>
          OK
        </Button>
      </Form>
    )
  }
}
