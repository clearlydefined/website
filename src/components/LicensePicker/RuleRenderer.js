// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import SpdxPicker from '../SpdxPicker'

export default class RuleRenderer extends Component {
  render() {
    const { index, rule, changeRulesOperator, updateLicense, considerLaterVersions, addNewGroup } = this.props

    return (
      <div key={index}>
        <SpdxPicker value={rule.license} onChange={value => updateLicense(value, index)} />
        <div>
          <input type="checkbox" onChange={event => considerLaterVersions(event.target.checked, index)} value="+" />
          Any later version
        </div>
        <select onChange={event => changeRulesOperator(event.target.value, index)}>
          <option />
          <option>WITH</option>
          <option>AND</option>
          <option>OR</option>
        </select>
        <button onClick={addNewGroup}>Add new Group</button>
      </div>
    )
  }
}
