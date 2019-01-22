// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { SpdxPicker } from './'
import withSuggestions from '../utils/withSuggestions'
class InlineEditor extends React.Component {
  static propTypes = {
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
    type: 'text',
    revertable: true
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

  onChangeEvent = event => {
    const { target } = event
    this.setState({ editing: false })

    // check browser validation (if used)
    if (target.checkValidity()) return this.onChange(target.value)
  }

  renderValue() {
    const { value, type, initialValue, placeholder, extraClass, readOnly, onClick } = this.props
    const { editing } = this.state
    const changed = initialValue !== value
    if (!editing)
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
    const { onClick, readOnly, initialValue, value, onRevert, revertable, suggested } = this.props
    const changed = initialValue !== value
    return (
      <span className="list-singleLine">
        <Fragment>
          {!readOnly && (
            <i
              className="fas fa-pencil-alt editable-marker"
              onClick={() => this.setState({ editing: true }, () => onClick && onClick())}
            />
          )}
          {!readOnly &&
            revertable && (
              <i
                className={`fas fa-undo editable-marker ${!changed && 'fa-disabled'}`}
                onClick={() => onRevert && changed && onRevert()}
              />
            )}
          {this.renderValue()}
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
    date: value => <input size="45" type="date" defaultValue={value} />,
    license: value => <SpdxPicker value={value} />
  }

  editorDefaults = {
    onBlur: this.onChangeEvent,
    onKeyPress: e => e.key === 'Enter' && this.onChangeEvent(e),
    ref: this.focus
  }

  editorProps = {
    text: this.editorDefaults,
    date: this.editorDefaults,
    license: {
      ...this.editorDefaults,
      onChange: this.onChange
    }
  }
}

export default withSuggestions(InlineEditor)
