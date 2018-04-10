// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { InlineEditor } from './'

export default class EditableComponent extends React.Component {
  static propTypes = {
    component: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    sortColumn: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      changes: {}
    }
  }

  fieldChange = field => value => {
    // if the field is set back to its original value, drop the change
    if (value === this.getOriginalValue(value)) {
      this.setState(
        {
          changes: {
            ...this.state.changes,
            [field]: undefined
          }
        },
        () => this.props.onChange(this.state.changes)
      )
      return
    }

    // otherwise, store the change in our state
    this.setState(
      {
        changes: {
          ...this.state.changes,
          [field]: value
        }
      },
      () => this.props.onChange(this.state.changes)
    )
  }

  // this will likely need some customizing for various fields
  getOriginalValue = field => {
    const { component } = this.props
    return component[field]
  }

  getValue = field => {
    const { changes } = this.state
    const { component } = this.props

    if (changes[field]) {
      return changes[field]
    } else {
      return this.getOriginalValue(field)
    }
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
            <InlineEditor type="text" value={this.getValue('name')} onChange={this.fieldChange('name')} />
            <div className="pull-right text-muted">[{sortColumn}]</div>
          </td>
        </tr>
      </React.Fragment>
    )
  }
}
