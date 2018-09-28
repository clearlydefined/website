// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

export default class Section extends Component {
  static propTypes = {
    actionButton: PropTypes.element
  }

  render() {
    const { name, actionButton, children } = this.props
    return (
      <div>
        <Row className="section-header">
          <Col sm={4}>
            <div className="section-title">{name}</div>
          </Col>
          <Col sm={8}>
            <div className="section-button">{actionButton}</div>
          </Col>
        </Row>
        {children}
      </div>
    )
  }
}
