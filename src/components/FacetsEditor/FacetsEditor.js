// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Grid, Row } from 'react-bootstrap'
import InlineEditor from '../InlineEditor'

// Hardcoded, maybe it should be kept somewhere else
const facets = ['data', 'dev', 'docs', 'examples', 'tests']

/**
 * Component that shows active facets for the files of the definition
 * Each facet is editable and it applies the change to the files of the definition
 */
class FacetsEditor extends Component {
  static propTypes = {
    classIfDifferent: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const { onChange, getValue, classIfDifferent } = this.props

    return (
      <Grid className="no-gutters">
        <h2>FACETS</h2>
        {facets.map(item => (
          <Row key={item}>
            <Col md={1}>
              <span>{item}</span>
            </Col>
            <Col md={11}>
              <InlineEditor
                extraClass={classIfDifferent(`described.facets.${item}`, 'facets__isEdited')}
                readOnly={false}
                type="text"
                initialValue={''}
                value={getValue(`described.facets.${item}`)}
                onChange={value => onChange(`described.facets.${item}`, value, 'array')}
                validator
                placeholder={`${item} facet`}
              />
            </Col>
          </Row>
        ))}
      </Grid>
    )
  }
}

export default FacetsEditor
