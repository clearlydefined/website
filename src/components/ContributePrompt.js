// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button } from 'react-bootstrap'
import { FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap'
import { FieldGroup } from './'

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
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({ ...this.state, [name]: value })
  }

  canSubmit() {
    const { details, resolution, summary, type } = this.state

    return type !== 'select' && summary.length > 0 && details.length > 0 && resolution.length > 0
  }

  render() {
    const { details, summary, show, type, resolution } = this.state
    const { session, onLogin } = this.props

    return (
      <Modal show={show} onHide={this.close} id="contribute-modal">
        <Form>
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
                    <Button bsStyle="success" data-test-id="login-button" onClick={onLogin}>
                      Login
                    </Button>
                  )}
                </div>
              </FormGroup>
              <FieldGroup
                className="inlineBlock pull-right"
                name="type"
                label="Type"
                value={type || 'select'}
                onChange={this.handleChange}
                placeholder="select"
                componentClass="select"
                required
              >
                <option value="select" disabled>
                  select
                </option>
                <option value="missing">Missing</option>
                <option value="incorrect">Incorrect</option>
                <option value="incomplete">Incomplete</option>
                <option value="ambiguous">Ambiguous</option>
                <option value="other">Other</option>
              </FieldGroup>
            </div>
            <FieldGroup
              name="summary"
              type="text"
              label="Summary"
              value={summary || ''}
              onChange={this.handleChange}
              placeholder="Short summary of changes. Like a commit message. Maximum 100 characters"
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
            <div>
              <Checkbox className="inlineBlock pull-left" name="removeDefinitions" onChange={this.handleChange}>
                Remove contributed definitions from the list
              </Checkbox>
              <FormGroup className="pull-right">
                <Button data-test-id="cancel-button" onClick={this.close}>
                  Cancel
                </Button>
                <Button
                  bsStyle="success"
                  data-test-id="contribute-button"
                  disabled={!this.canSubmit()}
                  type="button"
                  onClick={this.okHandler}
                >
                  OK
                </Button>
              </FormGroup>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
