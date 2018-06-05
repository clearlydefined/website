// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Table } from 'react-bootstrap'
import { uiNavigation } from '../actions/ui'

const Facets = {
  core: {},
  data: { backgroundColor: '#cfb7ff' },
  dev: { backgroundColor: '#fffa9e' },
  doc: { backgroundColor: '#9ee8ff' },
  examples: { backgroundColor: '#9effa7' },
  tests: { backgroundColor: '#ff9e9e' }
}

export default class FileTaggerRow extends Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.showFacets = this.showFacets.bind(this)
    this.hideFacets = this.hideFacets.bind(this)
    this.facetClicked = this.facetClicked.bind(this)
    this.state = {
      expanded: false,
      showFacets: false
    }
  }

  render() {
    const { entry, depth, facet, onFacetSelect } = this.props
    const { expanded, showFacets } = this.state
    const hasChildren = Object.keys(entry.children).length > 0
    const fullPath = entry.path.join('/')
    return (
      <React.Fragment>
        <tr key={fullPath} onMouseOver={this.showFacets} onMouseLeave={this.hideFacets} style={{...Facets[facet]}}>
          <td style={{ paddingLeft: `${15 * depth}px`, cursor: hasChildren ? 'pointer' : undefined }} onClick={this.toggle}>
            <div style={{ display: 'inline-block', width: '15px' }}>
              {hasChildren && <strong>{expanded ? '-' : '+'}</strong>}
            </div>
            {entry.name} <small>{entry.path.join('/')}</small>
          </td>
          <td style={{ width: '350px', fontSize: '0.7em', textAlign: 'right' }}>
            {showFacets && (
              <div>
                {Object.keys(Facets).map(f => (
                  <div
                    style={{
                      display: 'inline-block',
                      border: '1px solid #ccc',
                      padding: '2px 4px',
                      marginRight: '4px',
                      cursor: 'pointer',
                      ...Facets[f]
                    }}
                    onClick={() => this.facetClicked(f)}
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
        {expanded &&
          Object.entries(entry.children).map(([name, child]) => (
            <FileTaggerRow key={name} entry={child} depth={depth + 1} onFacetSelect={onFacetSelect} />
          ))}
      </React.Fragment>
    )
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  showFacets() {
    if (this.state.showFacets) {
      return
    }
    this.setState({ showFacets: true })
  }

  hideFacets(event) {
    this.setState({ showFacets: false })
  }

  facetClicked(facet) {
    const { entry, onFacetSelect } = this.props;
    onFacetSelect(entry, facet)
  }
}

/**
 * Check whether `path` is contained in parent/self path `parent`.
 *
 * Both are arrays of strings. Parent should be a subset of path starting at
 * index 0.
 */
function inPath(path, parent) {
  for (let i = 0; i < parent.length; i++) {
    if (path[i] !== parent[i]) {
      return false
    }
  }
  return true
}
