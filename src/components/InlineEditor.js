// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { SpdxPicker } from './'

export default class InlineEditor extends React.Component {
  static propTypes = {
    initialValue: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.oneOf(['text', 'date', 'license']).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired
  }

  static defaultProps = {
    type: 'text'
  }

  constructor(props) {
    super(props)
    this.state = { editing: false }
  }

  focus = ref => {
    if (ref && ref.focus) ref.focus()
  }

  onChange = nextValue => {
    const { value, onChange } = this.props

    this.setState({ editing: false })

    // sanity check for empty textboxes
    if (typeof nextValue === 'string' && nextValue.trim().length === 0) return this.renderValue()

    // don't bother saving unchanged fields
    if (nextValue === value) return

    onChange(nextValue)
  }

  onChangeEvent = event => {
    const { target } = event

    // check browser validation (if used)
    if (target.checkValidity()) return this.onChange(target.value)
  }

  renderValue() {
    const { value, type, initialValue, placeholder } = this.props
    const { editing } = this.state
    const changed = initialValue !== value
    if (!editing)
      return (
        <span
          className={`editable-field ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`}
          onClick={() => this.setState({ editing: true })}
        >
          {this.renderers[type](value) || placeholder}
        </span>
      )

    return React.cloneElement(this.editors[type](value), {
      onBlur: this.onChangeEvent,
      onChange: this.onChange,
      onKeyPress: e => e.key === 'Enter' && this.onChangeEvent(e),
      ref: this.focus
    })
  }

  render() {
    return (
      <div className="list-singleLine">
        <i className="fas fa-pencil-alt editable-marker" onClick={() => this.setState({ editing: true })} />
        {this.renderValue()}
      </div>
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
}
