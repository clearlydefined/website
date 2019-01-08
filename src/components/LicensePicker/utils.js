// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import parse from 'spdx-expression-parse'
import isNil from 'lodash/isNil'
import unset from 'lodash/unset'
import get from 'lodash/get'
import set from 'lodash/set'
const NOASSERTION = 'NOASSERTION'

// Shared methods appliable to License Picker
export default class LicensePickerUtils {
  static parseLicense(license) {
    return license ? parse(license) : {}
  }

  // Returns a license string based on the rules in input, following the specification of https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
  static stringify(obj) {
    if (!obj) return null
    if (obj.hasOwnProperty('noassertion')) return NOASSERTION
    if (obj.license) return `${obj.license}${obj.plus ? '+' : ''}${obj.exception ? ` WITH ${obj.exception}` : ''}`
    const left =
      obj.left && obj.left.conjunction && obj.left.conjunction.toLowerCase() === 'or'
        ? `(${this.stringify(obj.left)})`
        : this.stringify(obj.left)
    const right =
      obj.right && obj.right.conjunction && obj.right.conjunction.toLowerCase() === 'or'
        ? `(${this.stringify(obj.right)})`
        : this.stringify(obj.right)
    return left && `${left} ${!isNil(right) && obj.conjunction ? `${obj.conjunction.toUpperCase()} ${right}` : ''}`
  }

  static createGroup(obj, path) {
    if (path.length > 1 && obj.hasOwnProperty(path[0]) && obj[path[0]].hasOwnProperty(path[1])) {
      obj[path[0]] = this.createGroup(obj[path[0]], path.slice(1))
      return obj
    }
    if (path.length === 0)
      return {
        left: obj,
        conjunction: 'and',
        right: this.createGroupObject()
      }
    return {
      ...obj,
      [path[0]]: {
        ...obj[path[0]],
        right: this.createRuleObject(obj[path[0]].conjunction, obj[path[0]].right, this.createGroupObject())
      }
    }
  }

  static createRules(conjunction, obj, path) {
    if (path.length > 1 && obj.hasOwnProperty(path[0]) && obj[path[0]].hasOwnProperty(path[1])) {
      obj[path[0]] = this.createRules(conjunction, obj[path[0]], path.slice(1))
      return obj
    }
    if (path.length === 0) return this.createRuleObject(conjunction, obj.left || obj, obj.right && obj.right)
    const ruleConjunction = obj[path[0]] && obj[path[0]].conjunction ? obj.conjunction : conjunction
    const left =
      path[0] === 'left'
        ? obj.left && obj.left.conjunction
          ? this.createRuleObject(conjunction, obj.left.left, obj.left.right)
          : obj.left
        : obj.right && obj.right.conjunction
          ? obj.left
          : obj.conjunction !== conjunction
            ? obj
            : obj.left
    const right =
      path[0] === 'left'
        ? obj.right
        : obj.right && obj.right.conjunction
          ? this.createRuleObject(conjunction, obj.right.left, obj.right.right)
          : obj.conjunction === conjunction && this.createRuleObject(conjunction, obj.right)

    return this.createRuleObject(ruleConjunction, left, right)
  }

  static createGroupObject() {
    return {
      left: { license: '' },
      conjunction: 'and',
      right: { license: '' }
    }
  }

  static createRuleObject(conjunction, left, right) {
    return { conjunction, left, right: right || { license: '' } }
  }

  static removeRule(rules, path) {
    const parentPath = path.slice(0, path.length - 1)
    const pathToRemove = path[path.length - 1]
    const currentRule = get(rules, parentPath, rules)
    if (currentRule[pathToRemove === 'left' ? 'right' : 'left'].license === '') return rules
    unset(rules, path)
    const parentRule = get(rules, parentPath, rules)
    if (!parentRule.hasOwnProperty('right') || !parentRule.hasOwnProperty('left')) {
      const newRule = parentRule.left ? { ...parentRule.left } : { ...parentRule.right }
      if (parentPath.length > 0) set(rules, parentPath, newRule)
      else return newRule
    }
    return rules
  }
}
