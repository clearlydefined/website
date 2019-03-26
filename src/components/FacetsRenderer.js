// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'
import Icon from 'antd/lib/icon'
import Tag from 'antd/lib/tag'
import isEqual from 'lodash/isEqual'
import Contribution from '../utils/contribution'

const { Option } = Select

const nonCoreFacets = Contribution.defaultFacts.slice(1)

/**
 * Specific renderer for Facets
 *
 */
class FacetsRenderer extends Component {
  static propTypes = {
    isFolder: PropTypes.bool.isRequired,
    onFacetSelected: PropTypes.func,
    record: PropTypes.object,
    values: PropTypes.array.isRequired
  }

  state = {
    inputVisible: false
  }

  onFacetSelected = val => {
    const { onFacetSelected, record } = this.props
    onFacetSelected && onFacetSelected(val, record)
  }

  handleInputConfirm = inputValues => {
    const { onFacetSelected, record } = this.props

    if (!inputValues[0]) return this.setState({ inputVisible: false })

    const currentFacets = this.getFacetsForCurrentFolder()
    let newFacets = currentFacets
    if (currentFacets.indexOf(inputValues[0]) === -1) newFacets = [...currentFacets, inputValues[0]]
    if (inputValues.length > 0 && !isEqual(newFacets, currentFacets)) {
      onFacetSelected && onFacetSelected(newFacets, record)
    }
    this.setState({ inputVisible: false })
  }

  handleClose = removedFacet => {
    const { facets, record } = this.props
    const facetsFiltered = Object.values(facets).map(
      blobs => blobs.filter(blob => Contribution.folderMatchesBlob(record, blob)).length > 0
    )
    const currentFacets = Object.keys(facets).filter((_, i) => facetsFiltered[i])
    const newFacets = currentFacets.filter(glob => glob !== removedFacet)
    this.onFacetSelected(newFacets)
  }

  showInput = () => this.setState({ inputVisible: true })

  getFacetsForCurrentFolder = () => {
    const { isFolder, facets, record } = this.props
    if (!isFolder || !facets) return []
    const facetsFiltered = Object.values(facets).map(
      globs => globs.filter(glob => Contribution.folderMatchesGlob(record, glob)).length > 0
    )
    return Object.keys(facets).filter((_, i) => facetsFiltered[i])
  }

  renderExistingFacets = currentFacets => {
    const { facets, record } = this.props
    return currentFacets.map((tag, i) => {
      const isMatchingThisFolder =
        facets && facets[tag].filter(glob => Contribution.folderMatchesGlobExactly(record, glob)).length > 0
      return (
        <Tag key={i} closable={isMatchingThisFolder} afterClose={() => this.handleClose(tag)}>
          {tag}
        </Tag>
      )
    })
  }

  render() {
    const { isFolder, values } = this.props
    const { inputVisible } = this.state

    const currentFacets = this.getFacetsForCurrentFolder()

    return (
      <div>
        {values.length > 0
          ? values.map((val, i) => (
              <Tag
                key={i}
                closable={isFolder}
                afterClose={() => this.handleClose(val)}
                className={val.isDifferent ? 'facets--isEdited' : ''}
              >
                {val.value}
              </Tag>
            ))
          : currentFacets.length === 0 && <Tag>core</Tag>}
        {isFolder && this.renderExistingFacets(currentFacets)}
        {isFolder &&
          (!inputVisible ? (
            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          ) : (
            <Select
              autoFocus
              mode="tags"
              style={{ width: '50%' }}
              onChange={this.handleInputConfirm}
              onBlur={this.handleInputConfirm}
            >
              {nonCoreFacets
                .filter(el => !currentFacets.includes(el))
                .map(facet => (
                  <Option key={facet}>{facet}</Option>
                ))}
            </Select>
          ))}
      </div>
    )
  }
}

export default FacetsRenderer
