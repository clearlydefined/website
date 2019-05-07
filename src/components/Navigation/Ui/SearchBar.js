import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import FilterBar from '../../FilterBar'
import EntitySpec from '../../../utils/entitySpec'

export default class SearchBar extends Component {
  render() {
    const { filterOptions, onChange, onSearch, onClear } = this.props
    const coordinates = filterOptions.list
      .map(item => EntitySpec.isPath(item) && EntitySpec.fromPath(item))
      .filter(x => x)
    const names = coordinates.map(coordinate => {
      return { type: coordinate.type, name: EntitySpec.fromObject(coordinate).toPath() }
    })
    const options = { ...filterOptions, list: names }
    return (
      <Row className="show-grid spacer-search">
        <Col md={10} mdOffset={1}>
          <FilterBar options={options} onChange={onChange} onSearch={onSearch} clearOnChange onClear={onClear} />
        </Col>
      </Row>
    )
  }
}
