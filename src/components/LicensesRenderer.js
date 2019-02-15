// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InlineEditor } from './'
import { Modal } from 'react-bootstrap'
import LicensePicker from './LicensePicker'

/**
 * Specific renderer for Licenses data
 * It show a string of data, and if clicked allows user to edit inline
 * An advanced view will open a modal with an expression builder
 *
 */
class LicensesRenderer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      advancedView: false
    }
    this.toggleAdvancedView = this.toggleAdvancedView.bind(this)
    this.advancedPickerChange = this.advancedPickerChange.bind(this)
  }

  toggleAdvancedView() {
    this.setState(prevState => {
      return { advancedView: !prevState.advancedView }
    })
  }

  advancedPickerChange(spec, onChange) {
    onChange(spec)
    this.setState({ advancedView: false })
  }

  render() {
    const { extraClass, field, initialValue, onChange, onRevert, onSave, readOnly, revertable, value } = this.props
    const { advancedView } = this.state

    return (
      <div className="license-renderer">
        <InlineEditor
          field={field}
          extraClass={extraClass}
          readOnly={readOnly}
          initialValue={initialValue}
          value={value}
          onChange={onChange}
          onSave={onSave}
          validator={() => true}
          placeholder="SPDX license"
          revertable={revertable}
          onRevert={onRevert}
          type="license"
        />
        <i className="fas fa-eye license-advanced" onClick={this.toggleAdvancedView} />
        <Modal show={advancedView} onHide={this.toggleAdvancedView}>
          <LicensePicker
            onChange={spec => this.advancedPickerChange(spec, onChange)}
            onClose={this.toggleAdvancedView}
            value={value}
          />
        </Modal>
      </div>
    )
  }
}

LicensesRenderer.propTypes = {
  /**
   * item to show
   */
  value: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  onSave: PropTypes.func,
  readOnly: PropTypes.bool,
  field: PropTypes.string
}

export default LicensesRenderer
