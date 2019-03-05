// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import FilterBar from '../../FilterBar'

export default class SearchBar extends Component {
  render() {
    const { filterOptions, onChange, onSearch } = this.props
    return (
      <Row className="show-grid spacer">
        <Col md={10} mdOffset={1}>
          <FilterBar options={filterOptions} onChange={onChange} onSearch={onSearch} clearOnChange />
        </Col>
      </Row>
    )
  }
}
