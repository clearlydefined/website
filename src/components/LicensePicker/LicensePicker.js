// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import valid from 'spdx-expression-validate'
import set from 'lodash/set'
import toPath from 'lodash/toPath'
import { Button, Row, Col } from 'react-bootstrap'
import RuleBuilder from './RuleBuilder'
import LicensePickerUtils from './utils'
import './style.css'
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
    value: PropTypes.string, //existing license
    onChange: PropTypes.func, //callback function called when saving
    onClose: PropTypes.func //callback function called when closing the modal
  }

  componentDidMount() {
    this.setState({
      licenseExpression: this.props.value || '',
      rules: this.props.value ? LicensePickerUtils.parseLicense(this.props.value) : { license: '' },
      isValid: this.props.value ? valid(this.props.value) : false
    })
  }

  componentDidUpdate(_, prevState) {
    const { rules, sequence } = this.state
    if (sequence !== prevState.sequence) {
      const licenseExpression = LicensePickerUtils.toString(rules)
      this.setState({ ...this.state, licenseExpression, isValid: valid(licenseExpression) })
    }
  }

  updateLicense = async (value, path) => {
    if (!value) return
    const rules = { ...this.state.rules }
    const currentPath = [...path, 'license']
    set(rules, toPath(currentPath), value || '')
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
    const { onChange, onClose } = this.props
    const { rules, licenseExpression, isValid } = this.state
    return (
      <div className="spdx-picker">
        <Row>
          <Col md={10} className="spdx-picker-header-title flex-center">
            <h2>License Expression: </h2>
            <span className={`spdx-picker-expression ${isValid ? 'is-valid' : 'is-not-valid'}`}>
              {licenseExpression}
            </span>
          </Col>
          <Col md={2} className="spdx-picker-header-buttons">
            <Button
              bsStyle="success"
              data-test-id="license-picker-ok-button"
              disabled={false}
              onClick={() => onChange(licenseExpression)}
            >
              OK
            </Button>
            <Button bsStyle="danger" data-test-id="license-picker-cancel-button" disabled={false} onClick={onClose}>
              Cancel
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <RuleBuilder
              rule={rules}
              changeRulesOperator={this.changeRulesConjunction}
              updateLicense={this.updateLicense}
              considerLaterVersions={this.considerLaterVersions}
              addNewGroup={this.addNewGroup}
              removeRule={this.removeRule}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
