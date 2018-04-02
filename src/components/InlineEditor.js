// Copyright (c) Amazon.com, Inc. and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export default class InlineEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text']).isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    type: 'text'
  }

  constructor(props) {
    super(props)

    this.state = {
      initialValue: props.value,
      editing: false
    }
  }

  onChange = event => {
    const { value, onChange } = this.props

    const target = event.target

    // check browser validation (if used)
    if (!target.checkValidity()) {
      return
    }

    // sanity check for empty textboxes
    if (typeof target.value === 'string' && target.value.trim().length === 0) {
      return
    }

    this.setState({ editing: false })

    // don't bother saving unchanged fields
    if (target.value === value) {
      return
    }

    onChange(target.value)
  }

  render() {
    const { value, type } = this.props
    const { initialValue, editing } = this.state

    const changed = initialValue !== value

    if (!editing) {
      return (
        <span className={`editable-field ${changed ? 'bg-info' : ''}`} onClick={() => this.setState({ editing: true })}>
          {this.renderers[type](value)}
        </span>
      )
    }

    const editor = React.cloneElement(this.editors[type](value), {
      onBlur: this.onChange,
      onKeyPress: e => e.key === 'Enter' && this.onChange(e)
    })

    return editor
  }

  renderers = {
    text: value => value
  }

  editors = {
    text: value => <input type="text" defaultValue={value} />
  }
}
