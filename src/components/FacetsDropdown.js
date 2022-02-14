// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'
import isEqual from 'lodash/isEqual'
import Contribution from '../utils/contribution'

/**
 * Specific renderer for Facets
 *
 */
class FacetsDropdown extends Component {
  static propTypes = {
    isFolder: PropTypes.bool.isRequired,
    onFacetSelected: PropTypes.func,
    record: PropTypes.object,
    values: PropTypes.array.isRequired
  }

  static defaultProps = {
    isFolder: false
  }

  state = {
    inputVisible: false
  }

  onFacetSelected = (val, facet) => {
    const { onFacetSelected, record } = this.props
    onFacetSelected && onFacetSelected(val, record, facet)
  }

  handleInputConfirm = inputValues => {
    if (!inputValues[0]) return this.setState({ inputVisible: false })

    const currentFacets = this.getFacetsForCurrentFolder()
    let newFacets = currentFacets
    if (currentFacets.indexOf(inputValues[0]) === -1) newFacets = [...currentFacets, inputValues[0]]
    if (inputValues.length > 0 && !isEqual(newFacets, currentFacets)) {
      this.onFacetSelected(newFacets)
    }
    this.setState({ inputVisible: false })
  }

  getFacetsForCurrentFolder = () => {
    const { isFolder, facets, record } = this.props
    if (!isFolder || !facets) return []
    const facetsFiltered = Object.values(facets).map(
      globs => globs.filter(glob => Contribution.folderMatchesGlob(record, glob)).length > 0
    )
    return Object.keys(facets).filter((_, i) => facetsFiltered[i])
  }

  render() {
    const currentFacets = this.getFacetsForCurrentFolder()
    const { isFolder } = this.props
    return (
      <div className="facetsDropdown">
        {isFolder && <Select
          placeholder="--"
          style={{ width: '90%' }}
          onChange={this.handleInputConfirm}
        >
          {Contribution.nonCoreFacets
            .filter(el => !currentFacets.includes(el))
            .map(facet => (
              <Select.Option key={facet}>{facet}</Select.Option>
            ))}
        </Select> }
      </div>
    )
  }
}

export default FacetsDropdown
