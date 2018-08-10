// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import set from 'lodash/set'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import get from 'lodash/isEqual'
import EntitySpec from './entitySpec'

/**
 * Abstract methods for Contribution
 *
 */
export default class Contribution {
  /**
   * Build Contribution Spec from a list of components
   * @param {*} list
   */
  static buildContributeSpecFromList(list) {
    return list.reduce((result, component) => {
      return this.buildContributeSpec(result, component)
    }, [])
  }

  /**
   * Build Contribution Spec for a specific component
   * @param {*} result
   * @param {*} component
   */
  static buildContributeSpec(result, component) {
    if (!this.hasChange(component)) return result
    const coord = EntitySpec.asRevisionless(component)
    const patch = find(result, p => {
      return EntitySpec.isEquivalent(p.coordinates, coord)
    })
    const revisionNumber = component.revision
    const patchChanges = Object.getOwnPropertyNames(component.changes).reduce((result, change) => {
      set(result, change, component.changes[change])
      return result
    }, {})
    if (patch) {
      patch.revisions[revisionNumber] = patchChanges
    } else {
      const newPatch = { coordinates: coord, revisions: { [revisionNumber]: patchChanges } }
      result.push(newPatch)
    }
    return result
  }

  /**
   * Check if the current component has listed changes
   * @param  {} component
   */
  static hasChange(component) {
    return component.changes && Object.getOwnPropertyNames(component.changes).length
  }

  /**
   * Applies changes to the specific component
   * @param  {} component
   * @param  {} changes
   * @param  {} field
   * @param  {} value
   */
  static onChange(component, changes, field, value) {
    const isChanged = !isEqual(value, this.getOriginalValue(component, field))
    const newChanges = { ...changes }
    if (isChanged) newChanges[field] = value
    else delete newChanges[field]
    return newChanges
  }

  /**
   * Get the original value of the field into the definition
   * @param  {} component
   * @param  {} field
   */
  static getOriginalValue(component, field) {
    return get(component, field)
  }

  /**
   * Get the value of the specific field into the definition
   * Returns the updated value or the original one if not modified
   * @param  {} component
   * @param  {} changes
   * @param  {} field
   */
  static getValue(component, changes, field) {
    return changes && changes[field] ? changes[field] : this.getOriginalValue(component, field) || ''
  }
  /**
   * Verify any difference between changes values and original values
   * If true, return the true statement
   * @param  {} component
   * @param  {} changes
   * @param  {} field
   * @param  {} then_
   * @param  {} else_
   */
  static ifDifferent(component, changes, field, then_, else_) {
    return changes && changes[field] && !isEqual(changes[field], this.getOriginalValue(component, field))
      ? then_
      : else_
  }
  /**
   * Return a specific class name if the condition of difference it true
   * @param  {} component
   * @param  {} changes
   * @param  {} field
   * @param  {} className
   */
  static classIfDifferent(component, changes, field, className) {
    return this.ifDifferent(component, changes, field, className, '')
  }
}
