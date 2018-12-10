// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LicensePickerUtils from './utils'
import valid from 'spdx-expression-validate'
import RuleRenderer from './RuleRenderer'

/**
 * A standalone SPDX License Picker
 * It allows to build a license string based on license expression rules:
 * https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
 */
export default class LicensePicker extends Component {
  constructor(props) {
    super(props)
    this.ruleObject = {
      license: '',
      operator: '',
      laterVersions: false
    }
    this.state = {
      rules: [this.ruleObject],
      sequence: 0
    }
  }
  static propTypes = {
    //prop: PropTypes
  }

  updateLicense = (value, index) => {
    const rules = [...this.state.rules]
    rules[index] = { ...rules[index], license: value || '' }
    this.setState({ rules, sequence: this.state.sequence + 1 })
  }

  addNewRule = () => {
    const rules = [...this.state.rules]
    rules.push(this.ruleObject)
    this.setState({ rules })
  }

  changeRulesOperator = (value, index) => {
    const rules = [...this.state.rules]
    rules[index] = { ...rules[index], operator: value || '' }
    this.setState(
      {
        rules,
        sequence: this.state.sequence + 1
      },
      () => index === this.state.rules.length - 1 && this.addNewRule()
    )
  }

  considerLaterVersions = (value, index) => {
    const rules = [...this.state.rules]
    rules[index] = { ...rules[index], laterVersions: value || '' }
    this.setState({
      rules,
      sequence: this.state.sequence + 1
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { rules, sequence } = this.state
    if (sequence !== prevState.sequence) {
      const licenseExpression = LicensePickerUtils.getLicenseString(rules)
      this.setState({ licenseExpression, isValid: valid(licenseExpression) })
    }
  }

  render() {
    const { rules, licenseExpression, isValid } = this.state

    return (
      <div>
        <div>
          License Expression: <span style={{ background: `${isValid ? 'green' : 'red'}` }}>{licenseExpression}</span>
        </div>
        {rules.map((rule, index) => (
          <RuleRenderer
            key={index}
            index={index}
            rule={rule}
            changeRulesOperator={this.changeRulesOperator}
            updateLicense={this.updateLicense}
            considerLaterVersions={this.considerLaterVersions}
            addNewGroup={this.addNewGroup}
          />
        ))}
      </div>
    )
  }
}
