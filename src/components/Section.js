// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { withResize } from '../utils/WindowProvider'

class Section extends Component {
  static propTypes = {
    actionButton: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    titleCols: PropTypes.number,
    buttonCols: PropTypes.number
  }

  render() {
    const { name, className, actionButton, children, isMobile, titleCols, buttonCols } = this.props
    return (
      <div className={className}>
        {isMobile ? (
          <>
            <Row className="section-header">
              <Col xs={12}>
                <div className="section-title">{name}</div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="section-button">{actionButton}</div>
              </Col>
            </Row>
          </>
        ) : (
          <Row className="section-header">
            <Col md={titleCols || 4}>
              <div className="section-title">{name}</div>
            </Col>
            <Col md={buttonCols || 8}>
              <div className="section-button">{actionButton}</div>
            </Col>
          </Row>
        )}
        {children}
      </div>
    )
  }
}

export default withResize(Section)
