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
    classIfDifferent: ''
  }

  state = {
    currentItem: null,
    hasChanges: false,
    showAddRow: false,
    values: null
  }

  componentDidMount() {
    this.setState({ values: this.props.item.value })
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
    const { readOnly, container, classIfDifferent } = this.props
    const { hasChanges, values, showAddRow } = this.state

    if (!values) return null

    return (
      <div>
        <OverlayTrigger
          trigger="click"
          rootClose={readOnly || !hasChanges} // hide overlay when the user clicks outside the overlay
          container={container}
          placement="left"
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
          <div className={classIfDifferent}>{values && values[0] ? values[0].value : null}</div>
        </OverlayTrigger>
      </div>
    )
  }
}

CopyrightsRenderer.propTypes = {
  /**
   * item to show
   */
  item: PropTypes.shape({
    value: PropTypes.array
  }).isRequired,

  onSave: PropTypes.func,
  readOnly: PropTypes.bool,
  container: PropTypes.instanceOf(Element),
  classIfDifferent: PropTypes.string
}

export default CopyrightsRenderer
