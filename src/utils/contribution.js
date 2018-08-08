import set from 'lodash/set'
import find from 'lodash/find'
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
   *
   */
  static hasChange = entry => {
    return entry.changes && Object.getOwnPropertyNames(entry.changes).length
  }
}
