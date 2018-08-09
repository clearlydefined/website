import set from 'lodash/set'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import get from 'lodash/isEqual'
import has from 'lodash/isEqual'
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

  // Check if the current component has listed changes
  static hasChange(entry) {
    return entry.changes && Object.getOwnPropertyNames(entry.changes).length
  }

  // Applies changes to the specific component
  static onChange(component, changes, field, value) {
    const isChanged = !isEqual(value, this.getOriginalValue(component, field))
    const newChanges = { ...changes }
    if (isChanged) newChanges[field] = value
    else delete newChanges[field]
    return newChanges
  }

  // Get the original value of the field into the definition
  static getOriginalValue(component, field) {
    return get(component, field)
  }

  // Get the value of the specific field into the defintion
  // Returns the updated value or the original one if not modified
  static getValue(component, changes, field) {
    return changes && changes[field] ? changes[field] : this.getOriginalValue(component, field) || ''
  }

  static ifDifferent(component, changes, field, then_, else_) {
    return changes && changes[field] && !isEqual(changes[field], this.getOriginalValue(component, field))
      ? then_
      : else_
  }
  static classIfDifferent(component, changes, field, className) {
    console.log(this.ifDifferent(component, changes, field, className, ''))
    return this.ifDifferent(component, changes, field, className, '')
  }
}
