// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import set from 'lodash/set'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import get from 'lodash/get'
import transform from 'lodash/transform'
import isObject from 'lodash/isObject'
import EntitySpec from './entitySpec'

/**
 * Abstract methods for Contribution
 *
 */
export default class Contribution {
  /**
   * Build Contribution Spec from a list of components
   * @param {*} list list of components
   */
  static buildContributeSpecFromList(list) {
    return list.reduce((result, component) => {
      return this.buildContributeSpec(result, component)
    }, [])
  }

  /**
   * Build Contribution Spec for a specific component
   * @param {*} result initial object
   * @param {*} component original component
   */
  static buildContributeSpec(result, component, changes) {
    if (!this.hasChange(changes)) return result

    const coord = EntitySpec.fromCoordinates(component)
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
   * Build a Patch for a specific component
   * @param {*} result initial object
   * @param {*} component original component
   */
  static buildPatch(result, component, changes) {
    if (!this.hasChange(changes)) return result
    component.changes = { ...changes }
    const patchChanges = Object.getOwnPropertyNames(component.changes).reduce((result, change) => {
      set(result, change, component.changes[change])
      return result
    }, {})
    return patchChanges
  }

  /**
   * Check if the current component has listed changes
   * @param  {} changes
   */
  static hasChange(changes) {
    return changes && Object.getOwnPropertyNames(changes).length
  }

  /**
   * Applies changes to the specific component
   * @param  {} component original component
   * @param  {} changes object containing changes
   * @param  {} field field to check
   * @param  {} value value to apply to the field
   */
  static applyChanges(component, changes, field, value, type) {
    const isChanged = !isEqual(value, this.getOriginalValue(component, field))
    const newChanges = { ...changes }
    if (isChanged)
      type === 'array' ? (newChanges[field] = value.replace(/\s/g, '').split(',')) : (newChanges[field] = value)
    else delete newChanges[field]
    return newChanges
  }

  static getOriginalValue(component, field) {
    return get(component, field)
  }

  static getUpdatedValue(preview, field) {
    return get(preview, field)
  }

  /**
   * Get the value of the specific field into the definition
   * Returns the updated value or the original one if not modified
   * @param  {} component original component
   * @param  {} preview uptaded component sent back from the API after each change
   * @param  {} field field to check
   */
  static getValue(component, preview, field) {
    return preview && this.getUpdatedValue(preview, field)
      ? this.getUpdatedValue(preview, field)
      : this.getOriginalValue(component, field) || ''
  }

  /**
   * Verify any difference between changes values and original values
   * If true, return the true statement
   * @param  {} component original component
   * @param  {} changes object containing changes
   * @param  {} field field to check
   * @param  {} then_ condition returned if true
   * @param  {} else_ condition returned if false
   */
  static ifDifferent(component, changes, field, then_, else_) {
    return changes && changes[field] && !isEqual(changes[field], this.getOriginalValue(component, field))
      ? then_
      : else_
  }
  /**
   * Return a specific class name if the condition of difference it true
   * @param  {} component original component
   * @param  {} changes object containing changes
   * @param  {} field field to check
   * @param  {} className className to apply if the field has some changes
   */
  static classIfDifferent(component, changes, field, className) {
    return this.ifDifferent(component, changes, field, className, '')
  }

  /**
   * Check if the preview has some changes from the original definitions
   * Returns an object containing each change
   * @param {*} definition
   * @param {*} preview
   * @return {Object}        Return a new object who represent the diff
   */
  static getChangesFromPreview(definition, preview) {
    if (!definition || !preview) return
    return this.difference(preview, definition)
  }

  /**
   * Deep diff between two object, using lodash
   * @param  {Object} object Object compared
   * @param  {Object} base   Object to compare with
   * @return {Object}        Return a new object who represent the diff
   */
  static difference(object, base) {
    return transform(object, (result, value, key) => {
      if (isArray(value)) {
        return (result[key] = this.differenceBetweenObject(object[key], base[key]))
      }
      if (!isEqual(value, base[key])) {
        return (result[key] =
          isArray(value) && isArray(base[key])
            ? this.differenceBetweenObject(result[key], base[key])
            : isObject(value) && isObject(base[key])
              ? this.difference(value, base[key])
              : value)
      }
    })
  }

  // Compare 2 collections and returns a new array keeping the original keys
  static differenceBetweenObject(a, b) {
    let difference = []
    a.map((itemA, index) => {
      let find = false
      b.map(itemB => {
        if (isEqual(itemA, itemB)) {
          find = true
          return
        }
      })
      if (!find) {
        difference[index] = itemA
      }
    })
    return difference
  }
}
