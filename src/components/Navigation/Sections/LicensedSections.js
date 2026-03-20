// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Contribution from '../../../utils/contribution'
import TwoColumnsSection from '../Sections/TwoColumnsSection'
import { FileCountRenderer } from '../..'
import EnhancedLicensePicker from '../../../utils/EnhancedLicensePicker'
import CopyrightsRenderer from '../../CopyrightsRenderer'

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
    const parties = get(definition, 'licensed.attribution.parties', [])
    const originalParties = get(rawDefinition, 'licensed.facets.core.attribution.parties', [])
    const elements = [
      {
        label: 'Declared',
        field: 'licensed.declared',
        placeholder: 'SPDX license',
        type: 'license',
        editable: true,
        editor: EnhancedLicensePicker,
      },
      {
        label: 'Discovered',
        field: 'discovered.expressions',
        multiple: true,
      },
      {
        label: 'Attributions',
        field: 'attribution.parties',
        component: (
          <CopyrightsRenderer
            item={parties}
            initialValue={originalParties}
            onSave={updatedParties =>
              onChange && onChange('licensed.facets.core.attribution.parties', updatedParties, null, a => a)
            }
            readOnly={readOnly}
            field="licensed.facets.core.attribution.parties"
          />
        ),
      },

      {
        editable: true,
        field: 'files',
        label: 'Files',
        component: <FileCountRenderer detailView={true} definition={definition} />,
        lastIndex: true,
      }
    ]

    return (
      <TwoColumnsSection
        className="licensed-section"
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
