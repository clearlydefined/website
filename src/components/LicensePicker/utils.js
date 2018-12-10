// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// Shared methods appliable to License Picker
export default class LicensePickerUtils {
  // Returns a license string based on the rules in input, following the specification of https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
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
