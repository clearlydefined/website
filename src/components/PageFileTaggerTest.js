// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import FileTaggerRow from './FileTaggerRow'

export default class PageFileTaggerTest extends Component {
  constructor(props) {
    super(props)
    this.changeFacet = this.changeFacet.bind(this)
    this.state = {
      tree: pathsToTree(files),
      facetMap: facetMap
    }
  }

  render() {
    const { tree } = this.state
    return (
      <Grid className="main-container">
        <Row>
          <Col md={12}>
            <Table hover condensed>
              <tbody>
                <FileTaggerRow key="root" entry={tree} depth={0} onFacetSelect={this.changeFacet} />
              </tbody>
            </Table>

            <textarea className="form-control" value={JSON.stringify(this.state.facetMap, null, 2)} rows={10} />
            <textarea className="form-control" value={JSON.stringify(this.state.tree, null, 2)} rows={15}/>
          </Col>
        </Row>
      </Grid>
    )
  }

  changeFacet(node, facet) {
    const nodePath = node.path.join('/')
    this.setState({
      facetMap: {
        ...this.state.facetMap,
        [node.path.join('/')]: facet
      }
    })
  }
}


const files = ['src', 'src/examples', 'src/examples/blah.txt', 'src/examples/DOCS.txt', 'src/foo.c', 'test', 'test/bar.rs', 'LICENSE']
const facetMap = {'src/examples': 'examples', 'test': 'tests', 'src/examples/DOCS.txt': 'doc'}

function pathsToTree(paths) {
  const root = emptyNode('root')
  for (const path of paths) {
    buildPath(root, path.split('/'))
  }
  return root
}

function buildPath(base, parts, i = 0) {
  if (i == parts.length) {
    return
  }

  const item = parts[i]
  let child = base.children[item]
  if (!child) {
    child = emptyNode(item)
    child.path = parts.slice(0, i + 1)
    base.children[item] = child
  }
  buildPath(child, parts, i + 1)
}

function emptyNode(name) {
  return {
    name,
    path: [],
    children: {},
  }
}

