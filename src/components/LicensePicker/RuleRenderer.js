// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import SpdxPicker from '../SpdxPicker'

export default class RuleRenderer extends Component {
  constructor(props) {
    super(props)
  }

  renderRule = rule => {
    const { changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup } = this.props
    return (
      <div style={{ padding: '10px', border: '1px solid' }} key={rule.id}>
        <SpdxPicker value={rule.license} onChange={value => updateLicense(value, rule.id)} />
        <div>
          <input type="checkbox" onChange={event => considerLaterVersions(event.target.checked, rule.id)} value="+" />
          Any later version
        </div>
        <select onChange={event => changeRulesOperator(event.target.value, rule.id)}>
          <option />
          <option>WITH</option>
          <option>AND</option>
          <option>OR</option>
        </select>
        <button onClick={() => addNewGroup(rule)}>Add new Group</button>
        {rule.childrens.length > 0 && rule.childrens.map(children => this.renderRule(children))}
      </div>
    )
  }

  render() {
    const { rule } = this.props
    return this.renderRule(rule)
  }
}
