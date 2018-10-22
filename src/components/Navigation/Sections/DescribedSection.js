// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Contribution from '../../../utils/contribution'
import TwoColumnsSection from '../Sections/TwoColumnsSection'
import { SourcePicker } from '../..'

class DescribedSection extends Component {
  static propTypes = {
    rawDefinition: PropTypes.object,
    activeFacets: PropTypes.object,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    previewDefinition: PropTypes.object,
    curationSuggestions: PropTypes.object,
    handleRevert: PropTypes.func,
    applyCurationSuggestion: PropTypes.func
  }

  render() {
    const {
      rawDefinition,
      activeFacets,
      readOnly,
      onChange,
      previewDefinition,
      curationSuggestions,
      handleRevert,
      applyCurationSuggestion
    } = this.props
    const definition = Contribution.foldFacets(rawDefinition, activeFacets)
    const toolList = get(definition.described, 'tools', []).map(
      tool => (tool.startsWith('curation') ? tool.slice(0, 16) : tool)
    )

    const elements = [
      {
        label: 'Source',
        field: 'described.sourceLocation',
        placeholder: 'Source Location',
        type: 'coordinates',
        editable: true,
        editor: SourcePicker
      },
      {
        label: 'Tools',
        field: 'described.tools',
        editable: false,
        value: toolList.join(', ')
      },
      {
        label: 'Release',
        field: 'described.releaseDate',
        placeholder: 'YYYY-MM-DD',
        type: 'date',
        editable: true
      }
    ]

    return (
      <TwoColumnsSection
        elements={elements}
        definition={definition}
        readOnly={readOnly}
        onChange={onChange}
        previewDefinition={previewDefinition}
        curationSuggestions={curationSuggestions}
        handleRevert={handleRevert}
        applyCurationSuggestion={applyCurationSuggestion}
      />
    )
  }
}

export default DescribedSection
