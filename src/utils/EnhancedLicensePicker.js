import React, { Component } from 'react'
import LicensePicker from '../components/LicensePicker'
import withSuggestions from './withSuggestions'

class LicenseExpression extends Component {
  onChange = suggestion => this.props.onChange(suggestion)
  render() {
    const { isValid, licenseExpression } = this.props
    return (
      <span className={`spdx-picker-expression ${isValid ? 'is-valid' : 'is-not-valid'}`}>{licenseExpression}</span>
    )
  }
}

const EnhancedLicenseExpression = withSuggestions(LicenseExpression)

export default class EnhancedLicensePicker extends LicensePicker {
  renderLicenseExpression = (isValid, licenseExpression) => {
    return (
      <EnhancedLicenseExpression
        isValid={isValid}
        licenseExpression={licenseExpression}
        field={'licensed.declared'}
        {...this.props}
        onChange={suggestion => this.restoreRules(suggestion)}
      />
    )
  }
}
