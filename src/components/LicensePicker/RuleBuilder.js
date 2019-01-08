// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component, Fragment } from 'react'
import { ToggleButtonGroup, ToggleButton, Button } from 'react-bootstrap'
import SpdxPicker from '../SpdxPicker'

export default class RuleBuilder extends Component {
  constructor(props) {
    super(props)
  }
  renderRule = (rule, path, conjunction = null, parentRule = {}) => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup, removeRule } = this.props
    const currentPath = path[path.length - 1]
    if (rule.license || rule.license === '')
      return (
        <div style={{ background: 'red', padding: '10px' }}>
          {currentPath !== 'right' && (!parentRule.hasOwnProperty('left') && !parentRule.hasOwnProperty('right')) ? (
            <div style={{ display: 'flex' }}>
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

              <Button onClick={() => changeRulesOperator('AND', path)}>Add Rule</Button>
              <Button onClick={() => addNewGroup(path)}>Add Group</Button>
            </div>
          ) : null}
          <div style={{ display: 'flex' }}>
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
          </div>
        </div>
      )
    return (
      <div style={{ padding: '10px', background: 'blue' }}>
        <div style={{ display: 'flex' }}>
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

          <Button onClick={() => changeRulesOperator('AND', path)}>Add Rule</Button>
          <Button onClick={() => addNewGroup(path)}>Add Group</Button>
          {path.length > 0 && <Button onClick={() => removeRule(path)}>x</Button>}
        </div>
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
      </div>
    )
  }

  render() {
    const { rule } = this.props
    return <div style={{ display: 'flex' }}>{Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''}</div>
  }
}
