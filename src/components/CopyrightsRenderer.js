// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import { OverlayTrigger } from 'react-bootstrap'

import PopoverRenderer from './PopoverRenderer'

/**
 * Specific renderer for Copyrights data
 * It show the first Copyright, and if clicked opens a Popover containing a list of details
 *
 */
class CopyrightsRenderer extends Component {
  static defaultProps = {
    readOnly: false,
    container: null,
    classIfDifferent: '',
    placement: 'left'
  }

  state = {
    currentItem: null,
    hasChanges: false,
    showAddRow: false,
    values: []
  }

  componentDidMount() {
    this.props.item && this.setState({ values: this.props.item })
  }

  onShowAddRow = () => {
    this.setState({ showAddRow: true, currentItem: null })
  }

  undoEdit = () => {
    this.setState({ showAddRow: false, currentItem: null })
  }

  editRow = index => {
    this.setState({ showAddRow: false, currentItem: index })
  }

  deleteRow = index => {
    this.setState({ values: this.state.values.filter((_, itemIndex) => index !== itemIndex), hasChanges: true })
  }

  addItem = (value, updatedText) => {
    const { values, currentItem } = this.state
    const updatedObject = { value: updatedText || value, isDifferent: true }
    isNumber(currentItem) ? (values[currentItem] = updatedObject) : values.push(updatedObject)
    this.setState({ values, showAddRow: false, currentItem: null, hasChanges: true })
  }

  onSave = () => this.props.onSave(this.state.values.map(item => item.value))

  render() {
    const { readOnly, container, placement, classIfDifferent } = this.props
    const { hasChanges, values, showAddRow } = this.state

    if (!values.length && readOnly) return null

    return (
      <OverlayTrigger
        trigger="click"
        rootClose={readOnly || !hasChanges} // hide overlay when the user clicks outside the overlay
        container={container}
        placement={placement}
        overlay={
          <PopoverRenderer
            addItem={this.addItem}
            canAddItems={!readOnly}
            deleteRow={this.deleteRow}
            editable={!readOnly}
            editorPlaceHolder={'Copyright'}
            editorType={'text'}
            editRow={this.editRow}
            hasChanges={hasChanges}
            onSave={this.onSave}
            onShowAddRow={this.onShowAddRow}
            showAddRow={showAddRow}
            title={'Copyrights'}
            undoEdit={this.undoEdit}
            values={values}
          />
        }
      >
        <div className="copyrightContainer">
          {!readOnly && <i className="fas fa-pencil-alt editable-marker" />}
          <span className={classIfDifferent}>{values && values[0] ? values[0].value : null}</span>
        </div>
      </OverlayTrigger>
    )
  }
}

CopyrightsRenderer.propTypes = {
  /**
   * item to show
   */
  item: PropTypes.array,
  onSave: PropTypes.func,
  readOnly: PropTypes.bool,
  container: PropTypes.instanceOf(Element),
  classIfDifferent: PropTypes.string,
  placement: PropTypes.string
}

export default CopyrightsRenderer
