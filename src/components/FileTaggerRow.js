// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import PropTypes from 'prop-types'
import React, { Component } from 'react'

const Facets = {
  core: { backgroundColor: '#ffffff' },
  data: { backgroundColor: '#d4bfff' },
  dev: { backgroundColor: '#fffa9e' },
  doc: { backgroundColor: '#9ee8ff' },
  examples: { backgroundColor: '#9effa7' },
  tests: { backgroundColor: '#ffdac1' }
}

export default class FileTaggerRow extends Component {
  static propTypes = {
    entry: PropTypes.object.isRequired,
    fileFacets: PropTypes.objectOf(PropTypes.string).isRequired,
    onFacetSelect: PropTypes.func.isRequired,
    depth: PropTypes.number,
    parentFacet: PropTypes.string
  }

  static defaultProps = {
    depth: -1,
    parentFacet: 'core'
  }

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
    const { entry, depth } = this.props
    const { expanded, showFacets } = this.state

    // root node shouldn't itself be rendered
    if (entry.path.length === 0) {
      return this.renderChildren('core')
    }

    const hasChildren = Object.keys(entry.children).length > 0
    const fullPath = entry.path.join('/')

    const appliedFacet = this.findAppliedFacet()

    return (
      <React.Fragment>
        <tr
          key={fullPath}
          onMouseOver={this.showFacets}
          onMouseLeave={this.hideFacets}
          style={{ ...Facets[appliedFacet] }}
        >
          <td
            style={{ paddingLeft: `${15 * depth}px`, cursor: hasChildren ? 'pointer' : undefined }}
            onClick={this.toggle}
          >
            <div style={{ display: 'inline-block', width: '15px' }}>
              {hasChildren && <strong>{expanded ? '-' : '+'}</strong>}
            </div>
            {entry.name}
          </td>
          <td style={{ width: '350px', fontSize: '0.7em', textAlign: 'right' }}>
            {showFacets ? this.renderFacetPicker() : appliedFacet}
          </td>
        </tr>
        {expanded && this.renderChildren(appliedFacet)}
      </React.Fragment>
    )
  }

  renderChildren(appliedFacet) {
    const { entry, depth, fileFacets, onFacetSelect } = this.props
    return Object.entries(entry.children).map(([name, child]) => (
      <FileTaggerRow
        key={name}
        entry={child}
        depth={depth + 1}
        fileFacets={fileFacets}
        parentFacet={appliedFacet}
        onFacetSelect={onFacetSelect}
      />
    ))
  }

  renderFacetPicker() {
    return (
      <div>
        {Object.keys(Facets).map(f => (
          <div
            key={f}
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
    )
  }

  /**
   * Determine the facet that applies to this entry/row.
   */
  findAppliedFacet() {
    const { fileFacets, parentFacet, entry } = this.props

    const appliedFacet = fileFacets
      // filter facets for paths that match ours
      .filter(([facetparts, facet]) => {
        return inPath(entry.path, facetparts)
      })
      // find the longest path (highest precedence; "closest" to file)
      .reduce(
        (acc, curr) => {
          return curr[0].length > acc[0].length ? curr : acc
        },
        [[], null]
      )[1]

    // if no applied facet was found, it's probably "core", but just return the parent anyway
    return appliedFacet || parentFacet
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
    const { entry, parentFacet, onFacetSelect } = this.props
    // if we set a facet that would match the parent, just clear it
    if (facet === parentFacet) {
      onFacetSelect(entry, null)
    } else {
      onFacetSelect(entry, facet)
    }
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
