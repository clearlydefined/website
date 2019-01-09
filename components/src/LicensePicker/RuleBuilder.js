// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ToggleButtonGroup, ToggleButton, Button, Row, Col } from 'react-bootstrap'
import SpdxPicker from '../SpdxPicker'

export default class RuleBuilder extends Component {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    rule: PropTypes.object, //object containing current license rules
    changeRulesOperator: PropTypes.func, //callback function called when switching a conjunction operator
    updateLicense: PropTypes.func, //callback function called when changing a specific license value
    considerLaterVersions: PropTypes.func, //callback function called when applying a plus operator
    addNewGroup: PropTypes.func, //callback function called when adding a new license group object
    removeRule: PropTypes.func //callback function called when removing a single license or a group
  }
  renderRule = (rule, path, conjunction = null, parentRule = {}) => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup, removeRule } = this.props
    const currentPath = path[path.length - 1]
    if (rule.license || rule.license === '')
      return (
        <Col md={12} style={{ padding: '10px' }}>
          {currentPath !== 'right' && (!parentRule.hasOwnProperty('left') && !parentRule.hasOwnProperty('right')) ? (
            <Col md={12} style={{ padding: '0px', display: 'flex', justifyContent: 'space-between' }}>
              <ToggleButtonGroup
                type="radio"
                name="conjunction"
                defaultValue={conjunction}
                onChange={value => changeRulesOperator(value, path)}
              >
                <ToggleButton value={'AND'} disabled={rule.license === ''}>
                  AND
                </ToggleButton>
                <ToggleButton value={'OR'} disabled={rule.license === ''}>
                  OR
                </ToggleButton>
              </ToggleButtonGroup>
              <div>
                <Button onClick={() => changeRulesOperator('AND', path)}>Add Rule</Button>
                <Button onClick={() => addNewGroup(path)}>Add Group</Button>
              </div>
            </Col>
          ) : null}
          <Col md={4} style={{ display: 'flex', alignItems: 'center' }}>
            <SpdxPicker value={rule.license} onChange={value => updateLicense(value, path)} />
            {rule.license !== '' && (
              <Fragment>
                <div>
                  <input
                    type="checkbox"
                    onChange={event => considerLaterVersions(event.target.checked, path)}
                    value="+"
                  />
                  Any later version
                </div>
              </Fragment>
            )}
            {path.length > 0 && <Button onClick={() => removeRule(path)}>x</Button>}
          </Col>
        </Col>
      )
    return (
      <Col md={12} style={{ padding: '10px', paddingRight: '0px', background: 'lightgrey', border: '1px solid black' }}>
        <Col md={12} style={{ padding: '0px', display: 'flex', justifyContent: 'space-between' }}>
          <ToggleButtonGroup
            type="radio"
            name="conjunction"
            defaultValue={rule.conjunction}
            onChange={value => changeRulesOperator(value, path)}
          >
            <ToggleButton value={'AND'} disabled={rule.license === ''}>
              AND
            </ToggleButton>
            <ToggleButton value={'OR'} disabled={rule.license === ''}>
              OR
            </ToggleButton>
          </ToggleButtonGroup>
          <div>
            {!rule.left || !rule.right ? (
              <Button id="changeRulesOperator" onClick={() => changeRulesOperator('AND', path)}>
                Add Rule
              </Button>
            ) : null}
            <Button id="addNewGroup" onClick={() => addNewGroup(path)}>
              Add Group
            </Button>
            {path.length > 0 && (
              <Button id="removeRule" onClick={() => removeRule(path)}>
                x
              </Button>
            )}
          </div>
        </Col>
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
    return (
      <Row>
        <Col md={12} style={{ display: 'flex' }}>
          {Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''}
        </Col>
      </Row>
    )
  }
}
