// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isNumber from 'lodash/isNumber'
import { OverlayTrigger } from 'react-bootstrap'
import { Popover } from 'antd'

import PopoverRenderer from './PopoverRenderer'
import withSuggestions from '../utils/withSuggestions'

/**
 * Specific renderer for Copyrights data
 * It show the first Copyright, and if clicked opens a Popover containing a list of details
 *
 */
class CopyrightsContent extends Component {
  onChange = suggestion => {
    this.props.onChange(suggestion)
  }

  render() {
    const { classIfDifferent, values, readOnly, onClick } = this.props
    return (
      <div className="copyrightContainer" onClick={onClick}>
        {!readOnly && <i className="fas fa-pencil-alt editable-marker" />}
        <span className={classIfDifferent}>{values && values[0] ? values[0].value : null}</span>
      </div>
    )
  }
}

const EnhancedCopyrights = withSuggestions(CopyrightsContent)

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
    visible: false,
    originalValues: [],
    values: []
  }

  componentDidMount() {
    this.props.item && this.setState({ values: this.props.item, originalValues: this.props.item })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      values: nextProps.item.map(item => {
        return { value: item, isDifferent: !this.state.originalValues.find(originalItem => originalItem === item) }
      })
    })
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

  addItem = (value, updatedText, forceSave = false) => {
    const { values, currentItem } = this.state
    const updatedObject = { value: updatedText || value, isDifferent: true }
    isNumber(currentItem) ? (values[currentItem] = updatedObject) : values.push(updatedObject)
    this.setState({ values, showAddRow: false, currentItem: null, hasChanges: true }, () => forceSave && this.onSave())
  }

  onSave = () => {
    this.props.onSave(this.state.values.map(item => item.value))
    this.setState({ visible: false })
  }

  hide = () => {
    this.setState({
      visible: false
    })
  }

  handleVisibleChange = visible => {
    this.setState({ visible })
  }

  onChange = suggestion => this.addItem(suggestion, null, true)

  render() {
    const { readOnly, classIfDifferent, field } = this.props
    const { hasChanges, values, showAddRow, visible } = this.state

    if (!values.length && readOnly) return null

    return (
      <Popover
        overlayClassName="copyrights-renderer"
        trigger="click"
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        placement="left"
        content={
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
            placement="left"
          />
        }
      >
        <EnhancedCopyrights
          field={field}
          readOnly={readOnly}
          classIfDifferent={classIfDifferent}
          values={values}
          onChange={this.onChange}
        />
      </Popover>
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
