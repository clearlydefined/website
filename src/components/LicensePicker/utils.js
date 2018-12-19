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
        }${rule.laterVersions ? '+' : ''}${
          rule.childrens.length ? ` ${rule.operator} (${this.getLicenseString(rule.childrens)})` : ''
        }`
      })
      .join(` `)
  }

  static async findPath(rules, id) {
    const item = await this.deepFind(rules, id)
    return `${item.join('.childrens.')}`
  }

  static async deepFind(rulesList, id, indexes = []) {
    const item = rulesList.reduce((result, arrayItem, index) => {
      if (result.length) return result
      if (arrayItem.id === id) return [...indexes, index]
      return arrayItem.childrens.length ? this.deepFind(arrayItem.childrens, id, [...indexes, index]) : result
    }, [])
    return item
  }
}
