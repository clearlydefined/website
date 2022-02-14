// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ToggleButtonGroup, ToggleButton, Button, Row, Col } from 'react-bootstrap'
import SpdxPicker from '../SpdxPicker'
import CloseIcon from '@material-ui/icons/Close'

export default class RuleBuilder extends Component {
  static propTypes = {
    rule: PropTypes.object, //object containing current license rules
    changeRulesOperator: PropTypes.func, //callback function called when switching a conjunction operator
    updateLicense: PropTypes.func, //callback function called when changing a specific license value
    considerLaterVersions: PropTypes.func, //callback function called when applying a plus operator
    addNewGroup: PropTypes.func, //callback function called when adding a new license group object
    removeRule: PropTypes.func //callback function called when removing a single license or a group
  }

  renderHeaderRow = (rule, path, conjunction, showAddRule = false) => {
    const { changeRulesOperator, addNewGroup } = this.props
    return (
      <Col md={12} className="header-row">
        <ToggleButtonGroup
          type="radio"
          name="conjunction"
          defaultValue={conjunction}
          onChange={value => changeRulesOperator(value, path)}
        >
          {showAddRule && (!rule.left || !rule.right) ? (
            <Button id="changeRulesOperator" onClick={() => changeRulesOperator('AND', path)}>
              Add Rule
            </Button>
          ) : null}
          <ToggleButton value={'AND'} disabled={rule.license === ''}>
            AND
          </ToggleButton>
          <ToggleButton value={'OR'} disabled={rule.license === ''}>
            OR
          </ToggleButton>
        </ToggleButtonGroup>
        <div className="action-buttons">
          <Button id="changeRulesOperator" onClick={() => changeRulesOperator('AND', path)}>
            Add Rule
          </Button>
          <Button id="addNewGroup" onClick={() => addNewGroup(path)}>
            Add Group
          </Button>
        </div>
      </Col>
    )
  }

  renderRule = (rule, path, conjunction = null, parentRule = {}) => {
    const { updateLicense, considerLaterVersions, removeRule } = this.props
    const currentPath = path[path.length - 1]
    if (Object.keys(rule).includes('noassertion'))
      return (
        <Col md={12} className="spdx-picker-rule">
          {currentPath !== 'right' && !parentRule.hasOwnProperty('left') && !parentRule.hasOwnProperty('right')
            ? this.renderHeaderRow(rule, path, conjunction)
            : null}
          <Col md={12} className="flex-center">
            <SpdxPicker value={'NOASSERTION'} onChange={value => updateLicense(value, path)} />
            {/* {path.length > 0 && (
              <Button id="removeRule" onClick={() => removeRule(path)}>
                x
              </Button>
            )} */}
          </Col>
        </Col>
      )
    else if (rule.license || rule.license === '')
      return (
        <Col md={12} className="spdx-picker-rule">
          {currentPath !== 'right' && !parentRule.hasOwnProperty('left') && !parentRule.hasOwnProperty('right')
            ? this.renderHeaderRow(rule, path, conjunction)
            : null}
          <Col md={12} className="flex-center editable-container">
            <SpdxPicker value={rule.license} onChange={value => updateLicense(value, path)} />
            {rule.license && (
              <div>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={event => considerLaterVersions(event.target.checked, path)}
                  value="+"
                />
                Any later version
              </div>
            )}
            {path.length > 0 && (
              <Button id="removeRule" onClick={() => removeRule(path)}>
                <CloseIcon />
              </Button>
            )}
          </Col>
        </Col>
      )
    else
      return (
        <Col md={12} className="spdx-picker-rule">
          {this.renderHeaderRow(rule, path, rule.conjunction, true)}
          <div>
            {this.renderRule(
              rule.left,
              [...path, 'left'],
              rule.left.conjunction ? rule.left.conjunction : rule.conjunction,
              rule
            )}
          </div>
          <div>
            {this.renderRule(rule.right, [...path, 'right'], rule.right.conjunction && rule.right.conjunction, rule)}
          </div>
        </Col>
      )
  }

  render() {
    const { rule } = this.props
    console.log(rule)
    return (
      <Row>
        <Col md={12} className="flex">
          {Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''}
        </Col>
      </Row>
    )
  }
}
