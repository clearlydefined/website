// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component, Fragment } from 'react'
import toPath from 'lodash/toPath'
import SpdxPicker from '../SpdxPicker'

export default class RuleRenderer extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate() {
    return true
  }

  renderRule = (rule, path, conjunction) => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup } = this.props
    if (rule.license || rule.license === '')
      return (
        <div style={{ padding: '10px' }}>
          <SpdxPicker value={rule.license} onChange={value => updateLicense(value, path)} />
          <div>
            <input type="checkbox" onChange={event => considerLaterVersions(event.target.checked, path)} value="+" />
            Any later version
          </div>
          <select disabled={rule.license === ''} onChange={event => changeRulesOperator(event.target.value, path)}>
            <option />
            <option selected={conjunction === 'WITH' ? true : false}>WITH</option>
            <option selected={rule.license !== '' && conjunction === 'AND' ? true : false}>AND</option>
            <option selected={rule.license !== '' && conjunction === 'OR' ? true : false}>OR</option>
          </select>
          <button onClick={() => addNewGroup([...path, 'license'])}>Add new Group</button>
        </div>
      )
    console.log(path.slice(0, path.length - 1), rule)
    return (
      <Fragment>
        <div style={{ padding: '10px', border: rule.left && !rule.left.license ? '1px solid' : null }}>
          {this.renderRule(
            rule.left,
            [...path, 'left'],
            rule.left.conjunction ? rule.left.conjunction : rule.conjunction
          )}
        </div>
        {rule.left &&
          rule.left.conjunction && (
            <select onChange={event => changeRulesOperator(event.target.value, path)}>
              <option />
              <option selected={rule.conjunction === 'WITH' ? true : false}>WITH</option>
              <option selected={rule.conjunction === 'AND' ? true : false}>AND</option>
              <option selected={rule.conjunction === 'OR' ? true : false}>OR</option>
            </select>
          )}
        <div style={{ padding: '10px', border: rule.right && !rule.right.license ? '1px solid' : null }}>
          {this.renderRule(rule.right, [...path, 'right'], rule.right.conjunction && rule.right.conjunction)}
        </div>
        {rule.right &&
          rule.right.conjunction && (
            <select onChange={event => changeRulesOperator(event.target.value, path)}>
              <option />
              <option selected={rule.conjunction === 'WITH' ? true : false}>WITH</option>
              <option selected={rule.conjunction === 'AND' ? true : false}>AND</option>
              <option selected={rule.conjunction === 'OR' ? true : false}>OR</option>
            </select>
          )}
      </Fragment>
    )
  }

  render() {
    const { rule } = this.props
    return Object.keys(rule).length > 0 ? this.renderRule(rule, []) : ''
  }
}
