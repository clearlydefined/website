// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class ModalEditor extends React.Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    initialValue: PropTypes.string,
    extraClass: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired
  }

  state = { editing: false }

  onChange = nextValue => {
    const { value, onChange } = this.props
    if (nextValue === value) return
    onChange(nextValue)
  }

  renderValue() {
    const { value, initialValue, placeholder, extraClass, readOnly, onClick, editor, onChange } = this.props
    const { editing } = this.state
    const changed = initialValue !== value

    return (
      <span>
        <span
          title={value}
          className={`editable-field ${extraClass} ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`}
          onClick={() => (readOnly ? null : this.setState({ editing: true }, () => onClick && onClick()))}
        >
          {value || placeholder}
        </span>
        <Modal show={editing} onHide={() => this.setState({ editing: false })}>
          {React.createElement(editor, {
            onChange: spec => {
              onChange(spec)
              this.setState({ editing: false })
            },
            value
          })}
        </Modal>
      </span>
    )
  }

  render() {
    const { onClick, readOnly } = this.props
    return (
      <span className="list-singleLine">
        {!readOnly && (
          <i
            className="fas fa-pencil-alt editable-marker"
            onClick={() => this.setState({ editing: true }, () => onClick && onClick())}
          />
        )}
        {this.renderValue()}
      </span>
    )
  }
}
