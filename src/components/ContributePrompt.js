// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { FormGroup, ControlLabel, FormControl, Checkbox } from 'react-bootstrap'
import { FieldGroup } from './'
import Contribution from '../utils/contribution'

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
      username: PropTypes.string,
      publicEmails: PropTypes.bool
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

  handleChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({ ...this.state, [target.name]: value })
  }

  canSubmit() {
    const { details, resolution, summary, type } = this.state

    return type !== 'select' && summary.length > 0 && details.length > 0 && resolution.length > 0
  }

  renderTypeField() {
    return (
      <FieldGroup
        className="inlineBlock pull-right"
        name="type"
        label="Type"
        value={this.state.type || 'select'}
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
    )
  }

  renderEditedDefinitions = () => {
    const { definitions } = this.props
    return (
      <FormGroup>
        <ControlLabel>Involved Components</ControlLabel>
        <ul className="definitions-list">
          {definitions &&
            definitions.map(definition => {
              const image = Contribution.getImage({ coordinates: definition })
              return (
                <li key={image}>
                  {image && <img className="list-image" src={image} alt="" />}
                  <span className="definition-name">
                    {definition.namespace && `${definition.namespace}/`}
                    {definition.name}
                  </span>
                  <span className="definition-revision">{definition.revision}</span>
                </li>
              )
            })}
        </ul>
      </FormGroup>
    )
  }

  render() {
    const { details, summary, show, resolution } = this.state
    const { session, onLogin } = this.props
    return (
      <Modal show={show} id="contribute-modal">
        <Form>
          <Modal.Header closeButton onHide={this.close}>
            <Modal.Title>Describe the changes in this curation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!session?.isAnonymous && !session?.publicEmails && (
              <Alert bsStyle="warning">
                Since your email is set as private on your GitHub profile, you can submit this contribution but the
                commits will not be attributed to you.
              </Alert>
            )}
            <div className="container" style={{ display: 'flex' }}>
              <div className="contribution-container">
                <div>
                  <FormGroup className="inlineBlock">
                    <ControlLabel>Contributor</ControlLabel>
                    <div>
                      <FormControl.Static style={{ display: 'inline-block' }}>
                        {session?.isAnonymous ? 'anonymous' : `@${session?.username}`}
                      </FormControl.Static>{' '}
                      {session?.isAnonymous && (
                        <Button bsStyle="success" data-test-id="login-button" onClick={onLogin}>
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
              </div>
              <div className="definition-container">{this.renderEditedDefinitions()}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Checkbox className="inlineBlock pull-left" name="removeDefinitions" onChange={this.handleChange}>
                Remove contributed definitions from the list
              </Checkbox>
              <FormGroup className="pull-right">
                <Button
                  bsStyle="success"
                  data-test-id="contribute-button"
                  disabled={!this.canSubmit()}
                  type="button"
                  onClick={this.okHandler}
                >
                  OK
                </Button>
                <Button data-test-id="cancel-button" onClick={this.close}>
                  Cancel
                </Button>
              </FormGroup>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
