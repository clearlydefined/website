// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import withSuggestions from '../utils/withSuggestions'
class ModalEditor extends React.Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    initialValue: PropTypes.string,
    extraClass: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    onRevert: PropTypes.func,
    revertable: PropTypes.bool
  }

  static defaultProps = {
    revertable: true
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
      <span className="list-singleLine">
        <div
          title={value}
          className={`editable-field ${extraClass} ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`}
          onClick={() => (readOnly ? null : this.setState({ editing: true }, () => onClick && onClick()))}
        >
          {value || placeholder}
        </div>
        <Modal show={editing} onHide={() => this.setState({ editing: false })}>
          {React.createElement(editor, {
            onChange: spec => {
              onChange(spec)
              this.setState({ editing: false })
            },
            onClose: () => this.setState({ editing: false }),
            value
          })}
        </Modal>
      </span>
    )
  }

  render() {
    const { onClick, onRevert, revertable, readOnly, initialValue, value, field } = this.props
    const changed = initialValue !== value
    return (
      <span className="list-singleLine" name={field}>
        {!readOnly && (
          <i
            className="fas fa-pencil-alt editable-marker"
            onClick={() => this.setState({ editing: true }, () => onClick && onClick())}
          />
        )}
        {!readOnly && revertable && (
          <i
            className={`fas fa-undo editable-marker ${!changed && 'fa-disabled'}`}
            onClick={() => onRevert && changed && onRevert()}
          />
        )}
        {this.renderValue()}
      </span>
    )
  }
}

export default withSuggestions(ModalEditor)
