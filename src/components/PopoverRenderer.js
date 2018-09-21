// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import { Popover, Button, FormGroup, FormControl } from 'react-bootstrap'
import InlineEditor from './InlineEditor'

/**
 * Component that renders a Popover
 * Data could be string or array of objects
 *
 */
class PopoverRenderer extends Component {
  static propTypes = {
    addItem: PropTypes.func,
    canAddItems: PropTypes.bool.isRequired,
    deleteRow: PropTypes.func,
    editable: PropTypes.bool,
    editorPlaceHolder: PropTypes.string,
    editorType: PropTypes.oneOf(['text', 'date', 'license']),
    hasChanges: PropTypes.bool.isRequired,
    editRow: PropTypes.func,
    onSave: PropTypes.func,
    onShowAddRow: PropTypes.func,
    showAddRow: PropTypes.bool.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    undoEdit: PropTypes.func,
    values: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }

  state = {
    updatedText: ''
  }

  renderPopoverTitle() {
    const { title, canAddItems, onShowAddRow, hasChanges, onSave } = this.props
    return (
      <div className="popoverRenderer__title">
        <span>{title}</span>
        <div className="popoverRenderer__title__buttons">
          {canAddItems && (
            <Button
              onClick={() => {
                onShowAddRow()
                this.setState({ updatedText: '' })
              }}
              bsSize="xsmall"
            >
              <i className="fas fa-plus" />
            </Button>
          )}
          {hasChanges && (
            <Button onClick={onSave} bsSize="xsmall">
              <i className="fas fa-check" /> Done
            </Button>
          )}
        </div>
      </div>
    )
  }

  renderRow(item, index) {
    const { editable, editorType, editorPlaceHolder, addItem, editRow } = this.props
    const extraClass = item.isDifferent ? 'popoverRenderer__items__value--isEdited' : ''
    return (
      item && (
        <div key={`${item.value}_${index}`} className="popoverRenderer__items">
          <div className={`popoverRenderer__items__value ${extraClass}`}>
            {
              <InlineEditor
                extraClass={extraClass}
                readOnly={!editable}
                type={editorType}
                initialValue={item.value || ''}
                value={item.value || ''}
                onChange={addItem}
                validator
                placeholder={editorPlaceHolder}
                onClick={() => editRow(index)}
                revertable={false}
              />
            }
          </div>
          {editable && this.renderEditableButtons(index)}
        </div>
      )
    )
  }

  renderEditableButtons(index) {
    return (
      <div className="popoverRenderer__items__buttons">
        <Button onClick={() => this.props.deleteRow(index)} bsSize="xsmall">
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
            autoFocus
            placeholder="Enter text"
            value={updatedText}
            onChange={event => this.setState({ updatedText: event.target.value })}
            onBlur={() => {
              this.props.undoEdit()
              this.setState({ updatedText: '' })
            }}
            className="popoverRenderer__items__formControl"
          />
        </FormGroup>
        <Button onMouseDown={() => this.props.addItem(index, this.state.updatedText)} bsStyle="primary" bsSize="xsmall">
          <i className="fas fa-check" />
        </Button>
      </div>
    )
  }

  render() {
    const { editable, values, showAddRow, placement, positionLeft, positionTop } = this.props

    return (
      <Popover
        id="popover-positioned-left"
        placement={placement}
        positionLeft={positionLeft}
        positionTop={positionTop}
        title={this.renderPopoverTitle()}
        bsStyle={{ width: '500px' }}
      >
        <div className={`popoverRenderer ${editable ? '' : 'popoverRenderer_scrollY'}`}>
          {showAddRow && this.renderEditRow()}
          {values && isArray(values)
            ? values.map((item, index) => this.renderRow(item, index))
            : this.renderRow(values)}
        </div>
      </Popover>
    )
  }
}

export default PopoverRenderer
