// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import Select from 'antd/lib/select'
import Form from 'antd/lib/form'
import { Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { FieldGroup } from './'

const Option = Select.Option

export default class ContributePrompt extends Component {
  constructor(props) {
    super(props)
    this.state = { show: false, summary: '', details: '', resolution: '', type: 'select' }
    this.canSubmit = this.canSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.okHandler = this.okHandler.bind(this)
    this.close = this.close.bind(this)
  }

  static propTypes = {
    actionHandler: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    session: PropTypes.shape({
      isAnonymous: PropTypes.bool,
      username: PropTypes.string
    }).isRequired
  }

  open() {
    this.setState({
      show: true,
      summary: '',
      details: '',
      resolution: '',
      type: 'select',
      removeDefinitions: false
    })
  }

  close() {
    this.setState({ show: false })
  }

  okHandler(e) {
    this.close()
    const { show, ...contributionInfo } = this.state
    this.props.actionHandler(contributionInfo)
  }

  handleChange(event) {
    let target, value, name
    // for the Select of type
    if (!event.target) {
      value = event
      name = 'type'
    } else {
      target = event.target
      value = target.type === 'checkbox' ? target.checked : target.value
      name = target.name
    }
    this.setState({ [name]: value })
  }

  canSubmit() {
    const { details, resolution, summary, type } = this.state

    return type !== 'select' && summary.length > 0 && details.length > 0 && resolution.length > 0
  }

  renderTypeField() {
    return (
      <Form.Item className="pull-right" label="Type">
        <Select placeholder="Select" style={{ width: 120 }} onChange={this.handleChange}>
          <Option value="select" disabled>
            select
          </Option>
          <Option value="missing">Missing</Option>
          <Option value="incorrect">Incorrect</Option>
          <Option value="incomplete">Incomplete</Option>
          <Option value="ambiguous">Ambiguous</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
    )
  }

  render() {
    const { details, summary, show, resolution } = this.state
    const { session, onLogin } = this.props

    return (
      <Modal show={show} onHide={this.close} id="contribute-modal">
        <Form layout="vertical">
          <Modal.Header closeButton>
            <Modal.Title>Describe the changes in this curation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <FormGroup className="inlineBlock">
                <ControlLabel>Contributor</ControlLabel>
                <div>
                  <FormControl.Static style={{ display: 'inline-block' }}>
                    {session.isAnonymous ? 'anonymous' : `@${session.username}`}
                  </FormControl.Static>{' '}
                  {session.isAnonymous && (
                    <Button type="primary" data-test-id="login-button" onClick={onLogin}>
                      Login
                    </Button>
                  )}
                </div>
              </FormGroup>
              {this.renderTypeField()}
            </div>
            <FieldGroup
              name="summary"
              type="text"
              label="Title"
              value={summary || ''}
              onChange={this.handleChange}
              placeholder="Short (100 char) description"
              maxLength={100}
              required
            />
            <FieldGroup
              name="details"
              type="text"
              label="Details"
              value={details || ''}
              onChange={this.handleChange}
              placeholder="Describe here the problem(s) being addressed"
              maxLength={300}
              componentClass="textarea"
              rows="3"
              required
            />
            <FieldGroup
              name="resolution"
              type="text"
              label="Resolution"
              value={resolution || ''}
              onChange={this.handleChange}
              placeholder="What does this PR do to address the issue? Include references to docs where the new data was found and, for example, links to public conversations with the affected project team"
              maxLength={300}
              componentClass="textarea"
              rows="3"
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Checkbox className="inlineBlock pull-left" name="removeDefinitions" onChange={this.handleChange}>
              Remove contributed definitions from the list
            </Checkbox>
            <FormGroup className="pull-right">
              <Button data-test-id="cancel-button" onClick={this.close}>
                Cancel
              </Button>
              &nbsp;
              <Button
                type="primary"
                data-test-id="contribute-button"
                disabled={!this.canSubmit()}
                onClick={this.okHandler}
              >
                OK
              </Button>
            </FormGroup>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
