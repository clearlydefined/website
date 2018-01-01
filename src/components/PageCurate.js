// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { curateAction } from '../actions/curationActions'
import { CurationEditor } from './'

class PageCurate extends Component {

  constructor(props) {
    super(props)
    this.curateHandler = this.curateHandler.bind(this)
  }

  curateHandler(spec) {
    const { dispatch, token } = this.props
    dispatch(curateAction(token, spec))
  }

  render() {
    return (
      <Grid className='main-container'>
        <Row className='show-grid'>
          <CurationEditor proposeHandler={this.curateHandler} currentSpec='this is a test' />
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageCurate)