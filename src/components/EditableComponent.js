// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { InlineEditor } from './'

export default class EditableComponent extends React.Component {
  static propTypes = {
    component: PropTypes.any.isRequired,
    sortColumn: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { component, sortColumn } = this.props
    return (
      <React.Fragment>
        <tr>
          <td>
            <strong>{component.name}</strong>
          </td>
          <td>
            <strong>{component.source}</strong>
          </td>
          <td>
            <strong>[release]</strong>
          </td>
          <td>
            <strong>[decl license]</strong>
          </td>
          <td>
            <strong>[disc license]</strong>
          </td>
          <td>
            <strong>[modified by]</strong>
          </td>
        </tr>
        <tr>
          <td colSpan={6} style={{ borderTop: 'none' }}>
            additional component information here<br />
            <InlineEditor type="text" value="this part is editable" onChange={console.log} />
            <div className="pull-right text-muted">[{sortColumn}]</div>
          </td>
        </tr>
      </React.Fragment>
    )
  }
}
