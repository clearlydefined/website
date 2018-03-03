// Copyright (c) Microsoft Corporation and others. Made available under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'

export default class FieldGroup extends Component {

  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    help: PropTypes.oneOf([PropTypes.element, PropTypes.string])
  }

  render() {
    const { id, label, help } = this.props
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...this.props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    )
  }
}