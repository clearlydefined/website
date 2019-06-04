import React from 'react'
import LicensePicker from '../components/LicensePicker'
import withSuggestions from './withSuggestions'

const LicenseExpression = ({ isValid, licenseExpression }) => (
  <span className={`spdx-picker-expression ${isValid ? 'is-valid' : 'is-not-valid'}`}>{licenseExpression}</span>
)

const EnhancedLicenseExpression = withSuggestions(LicenseExpression)

export default class EnhancedLicensePicker extends LicensePicker {
  renderLicenseExpression = (isValid, licenseExpression) => {
    return <EnhancedLicenseExpression isValid={isValid} licenseExpression={licenseExpression} />
  }
}
