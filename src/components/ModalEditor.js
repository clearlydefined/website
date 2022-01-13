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
    const { onClick, readOnly, showEditIcon, field } = this.props
    return (
      <span className="list-singleLine detail-card" name={field}>
        {this.renderValue()}
        {showEditIcon && !readOnly && (
          <div className="edit-icon fas fa-pencil-alt editable-marker">
            <svg
              width="24"
              height="24"
              viewBox="0 0 25 25"
              onClick={() => this.setState({ editing: true }, () => onClick && onClick())}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path className="icon-tag" d="M22.5 19.5H1.5V21H22.5V19.5Z" fill="#383A43" />
              <path
                className="icon-tag"
                d="M19.05 6.75C19.65 6.15 19.65 5.25 19.05 4.65L16.35 1.95C15.75 1.35 14.85 1.35 14.25 1.95L3 13.2V18H7.8L19.05 6.75ZM15.3 3L18 5.7L15.75 7.95L13.05 5.25L15.3 3ZM4.5 16.5V13.8L12 6.3L14.7 9L7.2 16.5H4.5Z"
                fill="#383A43"
              />
            </svg>
          </div>

          // <i
          //   className="edit-icon fas fa-pencil-alt editable-marker"
          //   onClick={() => this.setState({ editing: true }, () => onClick && onClick())}
          // />
        )}
        {/* {!readOnly && revertable && (
          <i
            className={`fas fa-undo editable-marker ${!changed && 'fa-disabled'}`}
            onClick={() => onRevert && changed && onRevert()}
          />
        )} */}
      </span>
    )
  }
}

export default withSuggestions(ModalEditor)
