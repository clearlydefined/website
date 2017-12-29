// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { MonacoHarvestForm } from './'
import { harvestAction } from '../actions/harvestActions'
import { MonacoDiffEditor } from 'react-monaco-editor'

class PageHarvest extends Component {

  constructor(props) {
    super(props)
    this.harvestHandler = this.harvestHandler.bind(this)
  }

  harvestHandler(spec) {
    const { dispatch, token } = this.props
    dispatch(harvestAction(token, spec))
  }



  render() {
    return (
      <Grid className='main-container'>
        <Row className='show-grid'>
          <Col md={4} >
          </Col>
          <Col md={8}>
            <MonacoDiffEditor
              height='400'
              theme='vs-dark'
              language='json'
              original={'this is the original'}
              value={'curationValue'}
              options={{}}
              onChange={() => {}}
              editorDidMount={() => {}}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

// <MonacoHarvestForm harvestHandler={this.harvestHandler} />

function mapStateToProps(state, ownProps) {
  return { token: state.session.token }
}
export default connect(mapStateToProps)(PageHarvest)