// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LicensePickerUtils from './utils'
import valid from 'spdx-expression-validate'
import set from 'lodash/set'
import unset from 'lodash/unset'
import toPath from 'lodash/toPath'
import RuleBuilder from './RuleBuilder'

/**
 * A standalone SPDX License Picker
 * It allows to build a license string based on license expression rules:
 * https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
 */
export default class LicensePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rules: {},
      sequence: 0
    }
  }
  static propTypes = {
    value: PropTypes.string //existing license
  }

  componentDidMount() {
    this.setState({
      licenseExpression: this.props.value,
      rules: LicensePickerUtils.parseLicense(this.props.value),
      isValid: this.props.value ? valid(this.props.value) : false
    })
  }

  componentDidUpdate(_, prevState) {
    const { rules, sequence } = this.state
    if (sequence !== prevState.sequence) {
      const licenseExpression = LicensePickerUtils.stringify(rules)
      this.setState({ ...this.state, licenseExpression, isValid: valid(licenseExpression) })
    }
  }

  updateLicense = async (value, path) => {
    const rules = { ...this.state.rules }
    const currentPath = [...path, 'license']
    if (!value && currentPath !== ['license']) {
      unset(rules, `${currentPath}`)
    } else set(rules, toPath(currentPath), value || '')
    this.setState({ rules, sequence: this.state.sequence + 1 })
  }

  changeRulesConjunction = async (value, path) => {
    const rules = { ...this.state.rules }
    return this.setState({
      rules: LicensePickerUtils.createRules(value, rules, path),
      sequence: this.state.sequence + 1
    })
  }

  considerLaterVersions = async (value, path) => {
    const rules = { ...this.state.rules }
    const currentPath = [...path, 'plus']
    set(rules, toPath(currentPath), value || false)
    this.setState({ rules, sequence: this.state.sequence + 1 })
  }

  addNewGroup = async path => {
    // Add a children rule related to the rule element
    const rules = { ...this.state.rules }
    return this.setState({
      rules: LicensePickerUtils.createGroup(rules, path),
      sequence: this.state.sequence + 1
    })
  }

  removeRule = async rule => {
    const rules = { ...this.state.rules }
    return this.setState({
      rules: LicensePickerUtils.removeRule(rules, rule),
      sequence: this.state.sequence + 1
    })
  }

  render() {
    const { rules, licenseExpression, isValid } = this.state
    return (
      <div>
        <div>
          License Expression: <span style={{ background: `${isValid ? 'green' : 'red'}` }}>{licenseExpression}</span>
        </div>
        <RuleBuilder
          rule={rules}
          changeRulesOperator={this.changeRulesConjunction}
          updateLicense={this.updateLicense}
          considerLaterVersions={this.considerLaterVersions}
          addNewGroup={this.addNewGroup}
          removeRule={this.removeRule}
        />
      </div>
    )
  }
}
