// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

export default class Section extends Component {

  static propTypes = {
    name: PropTypes.string,
    actionButton: PropTypes.element,
  }

  render() {
    const { name, actionButton, children } = this.props
    const Name = name.charAt(0).toUpperCase() + name.slice(1)
    return (
      <div>
        <Row className='section-header'>
          <Col sm={10}>
            <div className='section-title'>{Name}</div>
          </Col>
          <Col sm={2}>
            <div className='section-button'>{actionButton}</div>
          </Col>
        </Row>
        {children}
      </div>
    )
  }
}
