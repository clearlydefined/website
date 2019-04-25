// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
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
      <div data-test-id="facets-editor">
        {Contribution.nonCoreFacets.map(item => (
          <Row key={item}>
            <Col sm={3} xs={4}>
              <span>{item}</span>
            </Col>
            <Col sm={9} xs={8}>
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
            </Col>
          </Row>
        ))}
      </div>
    )
  }
}

export default FacetsEditor
