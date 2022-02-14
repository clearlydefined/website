// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { SpdxPicker } from './'
import withSuggestions from '../utils/withSuggestions'

class InlineEditor extends React.Component {
  static propTypes = {
    editIcon: PropTypes.bool,
    field: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    initialValue: PropTypes.string,
    extraClass: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.oneOf(['text', 'date', 'license']).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    onRevert: PropTypes.func,
    revertable: PropTypes.bool
  }

  static defaultProps = {
    editIcon: true,
    extraClass: '',
    revertable: true,
    type: 'text'
  }

  state = { editing: false }

  focus = ref => {
    if (ref && ref.focus) ref.focus()
  }

  onChange = nextValue => {
    const { value, onChange, type } = this.props
    if (type !== 'date') this.setState({ editing: false })
    // sanity check for empty textboxes
    // if (typeof nextValue === 'string' && nextValue.trim().length === 0) return this.renderValue()
    // don't bother saving unchanged fields
    if (nextValue === value) return
    onChange(nextValue)
  }

  onChangeDate = event => this.setState({ dateValue: event.target.value })

  onChangeEvent = event => {
    const { target } = event
    this.setState({ editing: false })

    // check browser validation (if used)
    if (target.checkValidity()) return this.onChange(target.value)
  }

  renderValue() {
    const { value, type, initialValue, placeholder, extraClass, readOnly, onClick } = this.props
    const changed = initialValue !== value
    if (!this.state.editing)
      return (
        <span
          title={this.renderers[type](value)}
          className={`editable-field ${extraClass} ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`}
          onClick={() => (readOnly ? null : this.setState({ editing: true }, () => onClick && onClick()))}
        >
          {this.renderers[type](value) || placeholder}
        </span>
      )

    return React.cloneElement(this.editors[type](value), this.editorProps[type])
  }

  render() {
    const { editIcon, onClick, readOnly, field } = this.props
    return (
      <span className="list-singleLine" name={field}>
        <Fragment>
          {this.renderValue()}
          {!readOnly && editIcon && (
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
          )}
          {/* {!readOnly && revertable && (
            <i
              className={`fas fa-undo editable-marker ${!changed && 'fa-disabled'}`}
              onClick={() => onRevert && changed && onRevert()}
            />
          )} */}
        </Fragment>
      </span>
    )
  }

  renderers = {
    text: value => value,
    date: value => value,
    license: value => value
  }

  editors = {
    text: value => <input size="45" type="text" defaultValue={value} />,
    date: value => (
      <input
        className="date-picker"
        size="45"
        type="date"
        data-date={this.state.dateValue || value}
        defaultValue={value}
      />
    ),
    license: value => <SpdxPicker value={value} autoFocus={true} />
  }

  editorDefaults = {
    onBlur: this.onChangeEvent,
    onKeyPress: e => e.key === 'Enter' && this.onChangeEvent(e),
    ref: this.focus
  }

  editorProps = {
    text: this.editorDefaults,
    date: {
      ...this.editorDefaults,
      onChange: this.onChangeDate
    },
    license: {
      ...this.editorDefaults,
      onChange: this.onChange
    }
  }
}

export default withSuggestions(InlineEditor)
