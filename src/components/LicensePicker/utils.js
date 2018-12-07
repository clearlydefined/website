// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

export default class LicensePickerUtils {
  static getLicenseString(rules) {
    return rules
      .filter(rule => rule.license && rule.license !== '')
      .map((rule, index) => {
        return `${rules[index - 1] && rules[index - 1].operator !== '' ? `${rules[index - 1].operator} ` : ''}${
          rule.license
        }${rule.laterVersions ? '+' : ''}`
      })
      .join(` `)
  }
}
