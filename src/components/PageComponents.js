// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import 'react-select/dist/react-select.css'
import { getPackageListAction } from '../actions/packageActions'
import { FilterBar } from './'

class PageComponents extends Component {

  constructor(props) {
    super(props)
    this.filterChanged = this.filterChanged.bind(this)
  }

  componentDidMount() {
    const { dispatch, token, value } = this.props
    dispatch(getPackageListAction(token, value))
  }

  filterChanged(value) {
    this.setState({ ...this.state, value })
  }

  render() {
    const { options, value } = this.props
    return (
      <Grid className='main-container'>
          <FilterBar options={options} value={value} onChange={this.filterChanged}/>
        <Row className='show-grid'>
          <Col md={8}>
            The list of compoenents and a component filter etc will be here.
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token, value: state.ui.filterValue, options: state.package.list }
}
export default connect(mapStateToProps)(PageComponents)