// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Contribution from '../../utils/contribution'
import GlobsPicker from '../GlobsPicker'
import Curation from '../../utils/curation'

/**
 * Component that shows active facets for the files of the definition
 * Each facet is editable and it applies the change to the files of the definition
 */
class FacetsEditor extends Component {
  static propTypes = {
    definition: PropTypes.object,
    previewDefinition: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { onChange, definition, previewDefinition, readOnly, onRevert, curationSuggestions } = this.props

    return (
      <div data-test-id="facets-editor" className="facts-fields">
        {Contribution.nonCoreFacets.map(item => (
          <div className="row w-100 mx-0 justify-content-start align-items-center" key={item}>
            <div className="col-md-2  text-right col-3">
              <span>{item}</span>
            </div>
            <div className="col-md-10 col-9 px-4">
              <GlobsPicker
                field={`described.facets.${item}`}
                readOnly={readOnly}
                className={Contribution.classIfDifferent(
                  definition,
                  previewDefinition,
                  `described.facets.${item}`,
                  'facets--isEdited'
                )}
                globs={
                  Curation.getValue(curationSuggestions, `described.facets.${item}`)
                    ? Curation.getValue(curationSuggestions, `described.facets.${item}`)
                    : Contribution.getValue(definition, previewDefinition, `described.facets.${item}`)
                }
                suggested={Curation.getValue(curationSuggestions, `described.facets.${item}`)}
                onChange={value => onChange(`described.facets.${item}`, value)}
                onRevert={() => onRevert(`described.facets.${item}`)}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default FacetsEditor
