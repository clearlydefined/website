import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import FilterBar from '../../FilterBar'

export default class SearchBar extends Component {
  render() {
    const { filterOptions, onChange, onSearch, onClear } = this.props
    return (
      <Row className="show-grid spacer">
        <Col md={10} mdOffset={1}>
          <FilterBar options={filterOptions} onChange={onChange} onSearch={onSearch} clearOnChange onClear={onClear} />
        </Col>
      </Row>
    )
  }
}
