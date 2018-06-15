// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import FileTaggerRow from './FileTaggerRow'

export default class FileTagger extends Component {
  static propTypes = {
    fileList: PropTypes.arrayOf(PropTypes.string).isRequired,
    facetMap: PropTypes.objectOf(PropTypes.string).isRequired,
    onFacetMapChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.changeFacet = this.changeFacet.bind(this)
    this.state = {
      tree: pathsToTree(props.fileList)
    }
  }

  render() {
    const { facetMap } = this.props
    const { tree } = this.state

    const fileFacets = Object.entries(facetMap).map(([filepath, facet]) => {
      return [filepath.split('/'), facet]
    })

    return (
      <Table className="file-tagger" condensed>
        <tbody>
          <FileTaggerRow key="root" entry={tree} fileFacets={fileFacets} onFacetSelect={this.changeFacet} />
        </tbody>
      </Table>
    )
  }

  changeFacet(node, facet) {
    const { onFacetMapChange, facetMap } = this.props
    const nodePath = node.path.join('/')

    // erase a facet
    if (!facet) {
      const newMap = { ...facetMap }
      delete newMap[nodePath]
      onFacetMapChange(newMap)
      return
    }

    // update/add a facet
    onFacetMapChange({
      ...facetMap,
      [node.path.join('/')]: facet
    })
  }
}

function pathsToTree(paths) {
  const root = emptyNode('root')
  for (const path of paths) {
    buildPath(root, path.split('/'))
  }
  return root
}

function buildPath(base, parts, i = 0) {
  if (i === parts.length) {
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
    children: {}
  }
}
