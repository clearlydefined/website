// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import { parse } from '@clearlydefined/spdx'
import isNil from 'lodash/isNil'
import unset from 'lodash/unset'
import get from 'lodash/get'
import set from 'lodash/set'
const NOASSERTION = 'NOASSERTION'

// Shared methods appliable to License Picker
export default class LicensePickerUtils {
  static parseLicense(license) {
    return license && !['NONE', 'NOASSERTION', 'OTHER', 'PRESENCE OF', 'ABSENCE OF'].includes(license)
      ? parse(license)
      : { license }
  }

  static isValidExpression(expression) {
    try {
      return !!this.parseLicense(expression)
    } catch (e) {
      return false
    }
  }

  // Returns a license string based on the rules in input, following the specification of https://spdx.org/spdx-specification-21-web-version#h.jxpfx0ykyb60
  static toString(expression) {
    if (!expression) return null
    if (expression.hasOwnProperty('noassertion')) return NOASSERTION
    if (expression.license)
      return `${expression.license}${expression.plus ? '+' : ''}${
        expression.exception ? ` WITH ${expression.exception}` : ''
      }`
    const left =
      get(expression, 'left.conjunction', '').toLowerCase() === 'or'
        ? `(${this.toString(expression.left)})`
        : this.toString(expression.left)
    const right =
      get(expression, 'right.conjunction', '').toLowerCase() === 'or'
        ? `(${this.toString(expression.right)})`
        : this.toString(expression.right)
    return (
      left &&
      `${left} ${!isNil(right) && expression.conjunction ? `${expression.conjunction.toUpperCase()} ${right}` : ''}`
    )
  }

  /**
   * Creates a new License expressionect in the specified path
   * @param  {} expression original rules expressionect
   * @param  {} path where to create the new group
   * @returns updated expressionect rules
   */
  static createGroup(expression, path) {
    if (path.length > 1 && expression.hasOwnProperty(path[0]) && expression[path[0]].hasOwnProperty(path[1])) {
      expression[path[0]] = this.createGroup(expression[path[0]], path.slice(1))
      return expression
    }
    if (path.length === 0)
      return {
        left: expression,
        conjunction: 'and',
        right: this.createGroupObject()
      }
    return {
      ...expression,
      [path[0]]: {
        ...expression[path[0]],
        right: this.createRuleObject(
          expression[path[0]].conjunction,
          expression[path[0]].right,
          this.createGroupObject()
        )
      }
    }
  }

  /**
   * Creates a new License Rules in the specified path
   * @param  {} conjunction used conjunction to merge the new rules expressionects
   * @param  {} expression current expressionect rules
   * @param  {} path where apply the change
   * @returns updated expressionect rules
   */
  static createRules(conjunction, expression, path) {
    if (path.length > 1 && expression.hasOwnProperty(path[0]) && expression[path[0]].hasOwnProperty(path[1])) {
      expression[path[0]] = this.createRules(conjunction, expression[path[0]], path.slice(1))
      return expression
    }
    if (path.length === 0) return this.createRuleObject(conjunction, expression.left || expression, expression.right)
    const ruleConjunction =
      expression[path[0]] && expression[path[0]].conjunction ? expression.conjunction : conjunction
    const left =
      path[0] === 'left'
        ? get(expression, 'left.conjunction')
          ? this.createRuleObject(conjunction, expression.left.left, expression.left.right)
          : expression.left
        : expression.right && expression.right.conjunction
        ? expression.left
        : expression.conjunction !== conjunction
        ? expression
        : expression.left
    const right =
      path[0] === 'left'
        ? expression.right
        : get(expression, 'right.conjunction')
        ? this.createRuleObject(conjunction, expression.right.left, expression.right.right)
        : expression.conjunction === conjunction && this.createRuleObject(conjunction, expression.right)

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

  /**
   * Removes a specific rule from a path
   * @param  {} rules original rules expressionect
   * @param  {} path from where to remove the rule
   * @returns updated expressionect rules
   */
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
