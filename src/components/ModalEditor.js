// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import withSuggestions from '../utils/withSuggestions'

class ModalEditor extends React.Component {
  static propTypes = {
    editor: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    initialValue: PropTypes.string,
    extraClass: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onRevert: PropTypes.func,
    placeholder: PropTypes.string,
    revertable: PropTypes.bool,
    showEditIcon: PropTypes.bool,
    definition: PropTypes.object
  }

  static defaultProps = {
    revertable: true,
    showEditIcon: true
  }

  state = { editing: false }

  onChange = nextValue => {
    const { value, onChange } = this.props
    if (nextValue === value) return
    onChange(nextValue)
  }

  renderValue() {
    const {
      children,
      editor,
      extraClass,
      initialValue,
      onChange,
      onClick,
      placeholder,
      readOnly,
      showEditIcon,
      value,
      definition
    } = this.props
    const { editing } = this.state
    const changed = initialValue !== value

    const onClickFunc = e => {
      if (!readOnly) {
        e.stopPropagation()
        this.setState({ editing: true }, () => onClick && onClick())
      }
    }

    return (
      <span className="list-singleLine">
        {showEditIcon ? (
          <div
            title={value}
            className={`editable-field ${extraClass} ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`}
            onClick={onClickFunc}
          >
            {value || placeholder}
          </div>
        ) : (
          React.cloneElement(children, { onClick: onClickFunc }) || <p>{value || placeholder}</p>
        )}
        <Modal className="modal-xl" show={editing} onHide={() => this.setState({ editing: false })}>
          {React.createElement(editor, {
            onChange: spec => {
              onChange(spec)
              this.setState({ editing: false })
            },
            onClose: () => this.setState({ editing: false }),
            value,
            definition
          })}
        </Modal>
      </span>
    )
  }

  render() {
    const { onClick, onRevert, revertable, readOnly, showEditIcon, initialValue, value, field } = this.props
    const changed = initialValue !== value
    return (
      <span className="list-singleLine" name={field}>
        {showEditIcon && !readOnly && (
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
