// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Contribution from '../../../utils/contribution'
import TwoColumnsSection from '../Sections/TwoColumnsSection'
import LicensePicker from '../../LicensePicker'

class LicensedSection extends Component {
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
    const { licensed } = definition
    const totalFiles = get(licensed, 'files')
    const unlicensed = get(licensed, 'discovered.unknown')
    const unattributed = get(licensed, 'attribution.unknown')
    const unlicensedPercent = totalFiles ? Contribution.getPercentage(unlicensed, totalFiles) : '-'
    const unattributedPercent = totalFiles ? Contribution.getPercentage(unattributed, totalFiles) : '-'
    const elements = [
      {
        label: 'Declared',
        field: 'licensed.declared',
        placeholder: 'SPDX license',
        type: 'license',
        editable: true,
        editor: LicensePicker
      },
      {
        multiple: true,
        label: 'Attributions',
        field: 'attribution.parties'
      },
      {
        label: 'Discovered',
        field: 'discovered.expressions',
        multiple: true
      },
      {
        editable: true,
        field: 'files',
        label: 'Files',
        component: (
          <p className="list-singleLine">
            Total: <b>{totalFiles || '0'}</b>, Unlicensed:{' '}
            <b>{isNaN(unlicensed) ? '-' : `${unlicensed} (${unlicensedPercent}%)`}</b>, Unattributed:{' '}
            <b>{isNaN(unattributed) ? '-' : `${unattributed} (${unattributedPercent}%)`}</b>
          </p>
        )
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

export default LicensedSection
