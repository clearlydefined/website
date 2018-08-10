// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InlineEditor from '../InlineEditor'

// Hardcoded, maybe it should be kept somewhere
const facets = ['data', 'dev', 'docs', 'examples', 'tests']

/**
 * Component that shows active facets for the files of the definition
 * Each facet is editable and it applies the change to the files of the definition
 */
class FacetsEditor extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    definition: PropTypes.object,
    changes: PropTypes.object
  }

  render() {
    const { onChange, getValue, classIfDifferent } = this.props

    return (
      <div className="facetsEditor">
        <h2>FACETS</h2>
        <div>
          {facets.map(item => (
            <div key={item} className="item">
              <div className="column">
                <span>{item}</span>
              </div>
              <div className="column">
                <InlineEditor
                  extraClass={classIfDifferent(`described.facets.${item}`, 'facets__isEdited')}
                  readOnly={false}
                  type="text"
                  initialValue={''}
                  value={getValue(`described.facets.${item}`)}
                  onChange={value => onChange(`described.facets.${item}`, value)}
                  validator={value => true}
                  placeholder={`${item} facet`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default FacetsEditor
