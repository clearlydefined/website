// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class InlineEditor extends React.Component {
  static propTypes = {
    initialValue: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text']).isRequired,
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

  onChange = event => {
    const { value, onChange } = this.props
    const target = event.target

    // check browser validation (if used)
    if (!target.checkValidity()) return

    this.setState({ editing: false })

    // sanity check for empty textboxes
    if (typeof target.value === 'string' && target.value.trim().length === 0) return this.renderValue()

    // don't bother saving unchanged fields
    if (target.value === value) return

    onChange(target.value)
  }

  renderValue() {
    const { value, type, initialValue, placeholder } = this.props
    const { editing } = this.state
    const changed = initialValue !== value
    if (!editing)
      return (
        <span className={`editable-field ${value ? (changed ? 'bg-info' : '') : 'placeholder-text'}`} onClick={() => this.setState({ editing: true })}>
          {this.renderers[type](value) || placeholder}
        </span >
      )

    return React.cloneElement(this.editors[type](value), {
      onBlur: this.onChange,
      onKeyPress: e => e.key === 'Enter' && this.onChange(e),
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
    text: value => value
  }

  editors = {
    text: value => <input type="text" defaultValue={value} />
  }
}
