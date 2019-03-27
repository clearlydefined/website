// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'

export default class FieldGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    help: PropTypes.oneOf([PropTypes.element, PropTypes.string])
  }

  render() {
    const { id, label, help, className, ...otherProps } = this.props
    return (
      <FormGroup controlId={id} className={className}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...otherProps} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    )
  }
}
