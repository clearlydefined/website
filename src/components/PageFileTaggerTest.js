// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import FileTagger from './FileTagger';

export default class PageFileTaggerTest extends Component {
  constructor(props) {
    super(props)
    this.onFacetMapChange = this.onFacetMapChange.bind(this)
    this.state = {
      facetMap: facetMap
    }
  }

  render() {
    const { facetMap } = this.state
    return (
      <Grid className="main-container">
        <Row>
          <Col md={12}>
            <FileTagger fileList={files} facetMap={facetMap} onFacetMapChange={this.onFacetMapChange} />

            <h4>debug stuff</h4>
            <textarea
              readOnly
              className="form-control"
              value={JSON.stringify(this.state.facetMap, null, 2)}
              rows={10}
            />
          </Col>
        </Row>
      </Grid>
    )
  }

  onFacetMapChange(facetMap) {
    this.setState({facetMap})
  }
}

const files = [
  'src',
  'src/examples',
  'src/examples/blah.txt',
  'src/examples/DOCS.txt',
  'src/foo.c',
  'test',
  'test/bar.rs',
  'LICENSE'
]
const facetMap = { 'src/examples': 'examples', test: 'tests', 'src/examples/DOCS.txt': 'doc' }
