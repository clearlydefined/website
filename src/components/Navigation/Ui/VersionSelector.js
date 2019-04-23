// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, FormGroup, Button } from 'react-bootstrap'
import { Select } from 'antd'
import { getRevisions } from '../../../api/clearlyDefined'
import Definition from '../../../utils/definition'

const Option = Select.Option
class VersionSelector extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    component: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = { options: [], selected: [], label: '' }
  }

  async componentDidMount() {
    const { component, token, multiple } = this.props
    if (!component) return
    const fullname = component.namespace ? `${component.namespace}/${component.name}` : component.name
    try {
      const label = multiple
        ? `Pick one or move versions of ${fullname} to add to the definitions list`
        : `Pick a different version of ${fullname}`
      const options = await getRevisions(token, fullname, component.type, component.provider)
      this.setState({ options, label })
    } catch (error) {
      this.setState({ options: [] })
    }
  }

  handleChange = value => {
    this.setState({ selected: value })
  }

  doSave = () => {
    const { onSave } = this.props
    const { selected } = this.state
    this.setState({ options: [], selected: [], label: '' }, () => onSave(selected))
  }

  onClose = () => {
    const { onClose } = this.props
    this.setState({ options: [], selected: [], label: '' }, () => onClose())
  }

  render() {
    const { multiple, show, component } = this.props
    const { options, label, selected } = this.state

    return (
      <Modal show={show} onHide={this.onClose} backdrop={selected.length > 0 ? 'static' : true}>
        <Modal.Header closeButton>
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <Select
              mode={multiple && 'multiple'}
              style={{ width: '100%' }}
              placeholder={label}
              onChange={this.handleChange}
            >
              {options.map(option => (
                <Option key={Definition.getRevisionToKey(option, component)}>
                  {Definition.getRevisionToString(option, component)}
                </Option>
              ))}
            </Select>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <FormGroup className="pull-right">
            <Button bsStyle="success" type="button" disabled={selected.length === 0} onClick={() => this.doSave()}>
              OK
            </Button>
            <Button onClick={this.onClose}>Cancel</Button>
          </FormGroup>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default VersionSelector
