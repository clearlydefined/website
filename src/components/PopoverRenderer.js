// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isEqual from 'lodash/isEqual'
import isNumber from 'lodash/isNumber'
import { Popover, Button, FormGroup, FormControl } from 'react-bootstrap'
/**
 * Component that renders a Popover
 * Data could be string or array of strings
 *
 */
class PopoverComponent extends Component {
  static propTypes = {
    /**
     * title to show on the Popover
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    /**
     * values to show, it can be string o either an array
     */
    values: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }

  constructor(props) {
    super(props)

    this.state = {
      showAddRow: false,
      values: null,
      hasChanges: false,
      updatedText: ''
    }

    this.showAddRow = this.showAddRow.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editRow = this.editRow.bind(this)
    this.deleteRow = this.deleteRow.bind(this)
    this.updateText = this.updateText.bind(this)
    this.undoEdit = this.undoEdit.bind(this)
  }

  componentDidMount() {
    this.setState({ values: this.props.values })
  }

  renderPopoverTitle() {
    return (
      <div className="popoverRenderer__title">
        <span>{this.props.title}</span>
        <div className="popoverRenderer__title__buttons">
          {this.props.editable && (
            <Button onClick={() => this.showAddRow()} bsSize="xsmall">
              <i className="fas fa-plus" />
            </Button>
          )}
          {this.state.hasChanges && (
            <Button onClick={() => this.onSave()} bsSize="xsmall">
              <i className="fas fa-check" /> Done
            </Button>
          )}
        </div>
      </div>
    )
  }

  renderRow(item, index) {
    const { editable } = this.props
    const { currentItem } = this.state
    return index === currentItem ? (
      this.renderEditRow(index)
    ) : (
      <div key={`${item.value}_${index}`} className={`popoverRenderer__items`}>
        <span
          className={`popoverRenderer__items__value ${item.isDifferent && 'popoverRenderer__items__value--isEdited'}`}
        >
          {item.value}
        </span>
        {editable && this.renderEditableButtons(index)}
      </div>
    )
  }

  renderEditableButtons(index) {
    return (
      <div className="popoverRenderer__items__buttons">
        <Button onClick={() => this.editRow(index)} bsSize="xsmall">
          <i className="fas fa-pencil-alt" />
        </Button>
        <Button onClick={() => this.deleteRow(index)} bsSize="xsmall">
          <i className="fas fa-trash-alt" />
        </Button>
      </div>
    )
  }

  renderEditRow(index) {
    const { updatedText } = this.state
    return (
      <div key={index} className="popoverRenderer__items">
        <FormGroup className="popoverRenderer__items__formGroup">
          <FormControl
            type="text"
            placeholder="Enter text"
            value={updatedText}
            onChange={this.updateText}
            onBlur={this.undoEdit}
            className="popoverRenderer__items__formControl"
          />
        </FormGroup>
        <Button onMouseDown={() => this.addItem(index)} bsStyle="primary" bsSize="xsmall">
          <i className="fas fa-check" />
        </Button>
      </div>
    )
  }

  showAddRow() {
    this.setState({ showAddRow: true, currentItem: null, updatedText: '' })
  }

  undoEdit() {
    this.setState({ showAddRow: false, currentItem: null, updatedText: '' })
  }

  editRow(index) {
    const { values } = this.state
    this.setState({ showAddRow: false, currentItem: index, updatedText: values[index].value })
  }

  deleteRow(index) {
    const { values } = this.state
    this.setState({ values: values.filter((_, itemIndex) => index !== itemIndex), hasChanges: true })
  }

  updateText(event) {
    this.setState({ updatedText: event.target.value })
  }

  addItem(index) {
    const { values, updatedText } = this.state
    const updatedObject = { value: updatedText, isDifferent: true }
    isNumber(index) ? (values[index] = updatedObject) : values.push(updatedObject)
    this.setState({ values, showAddRow: false, hasChanges: true, updatedText: '', currentItem: null })
  }

  onSave() {
    this.props.onSave(this.state.values.map(item => item.value))
  }

  render() {
    const { showAddRow, values } = this.state
    return (
      <Popover id="popover-positioned-left" {...this.props} title={this.renderPopoverTitle()}>
        <div className="popoverRenderer">
          {showAddRow && this.renderEditRow()}
          {values && isArray(values) ? values.map((item, index) => this.renderRow(item, index)) : <p>{values}</p>}
        </div>
      </Popover>
    )
  }
}

export default PopoverComponent
