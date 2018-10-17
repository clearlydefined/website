// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import set from 'lodash/set'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import union from 'lodash/union'
import compact from 'lodash/compact'
import EntitySpec from './entitySpec'
import github from '../images/GitHub-Mark-120px-plus.png'
import npm from '../images/n-large.png'
import pypi from '../images/pypi.png'
import gem from '../images/gem.png'
import nuget from '../images/nuget.svg'
import moment from 'moment'
import { difference } from './utils'

/**
 * Abstract methods for Contribution
 *
 */
export default class Contribution {
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
    const patchChanges = this.buildPatch(result, component, changes)
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
    if (patchChanges.files) patchChanges.files = compact(patchChanges.files)
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
   *
   * Applies changes to the specific component
   * @static
   * @param  {} component original component
   * @param  {} changes object containing changes
   * @param  {} field field to check
   * @param  {} value value to apply to the field
   * @param  {} type used to specify a type of field (e.g. array) to perform different kind of operations
   * @param  {} [transform=a => a] function to transform the `value`. E.g. to parse the URL string and return a sourceLocation object
   */
  static applyChanges(component, changes, field, value, type, transform = a => a) {
    const proposedValue = transform(value)
    const newChanges = { ...changes }
    if (!isEqual(proposedValue, this.getOriginalValue(component, field)))
      type === 'array'
        ? (newChanges[field] = proposedValue.replace(/\s/g, '').split(','))
        : (newChanges[field] = proposedValue)
    else delete newChanges[field]
    return newChanges
  }

  static getOriginalValue(component, field) {
    return get(component, field) || ''
  }

  static getUpdatedValue(preview, field) {
    return get(preview, field) || ''
  }

  /**
   * Get the value of the specific field into the definition
   * Returns the updated value or the original one if not modified
   * @param  {Object} component original component
   * @param  {Object} preview updated component sent back from the API after each change
   * @param  {String} field field to check
   */
  static getValue(component, preview, field) {
    return preview && this.getUpdatedValue(preview, field)
      ? this.getUpdatedValue(preview, field)
      : this.getOriginalValue(component, field) || ''
  }

  /**
   * Get the value AND if it was Updated of the specific field into the definition
   * Returns the updated value or the original one if not modified
   *
   * @param  {Object} component original component
   * @param  {Object} preview updated component sent back from the API after each change
   * @param  {String} field field to check
   */

  static getValueAndIfDifferent(component, preview, field) {
    if (preview) {
      return {
        value: this.getValue(component, preview, field),
        isDifferent: this.ifDifferent(component, preview, field, true, false)
      }
    }
    const originalValues = get(component, field)
    if (!originalValues || !originalValues.length) {
      return [
        {
          value: 'core',
          isDifferent: false
        }
      ]
    }
    return originalValues.map(value => ({
      value: value || 'core',
      isDifferent: false
    }))
  }

  /**
   * Verify any difference between changes values and original values
   * If true, return the true statement
   * @param  {} component original component
   * @param  {} preview object containing changes
   * @param  {} field field to check
   * @param  {} then_ condition returned if true
   * @param  {} else_ condition returned if false
   */
  static ifDifferent(component, preview, field, then_, else_) {
    return preview &&
      this.getUpdatedValue(preview, field) &&
      !isEqual(this.getUpdatedValue(preview, field), this.getOriginalValue(component, field))
      ? then_
      : else_
  }

  /**
   * Return a specific class name if the condition of difference it true
   * @param  {} component original component
   * @param  {} preview object containing changes
   * @param  {} field field to check
   * @param  {} className className to apply if the field has some changes
   */
  static classIfDifferent(component, preview, field, className) {
    return this.ifDifferent(component, preview, field, className, '')
  }

  /**
   * Check if the preview has some changes from the original definitions
   * Returns an object containing each change
   * @param {*} definition
   * @param {*} preview
   * @return {Object} Return a new object which represents the diff
   */
  static getChangesFromPreview(definition, preview) {
    if (isEmpty(definition) || isEmpty(preview)) return
    return difference(preview, definition)
  }

  static printCoordinates = value => (value && value.url ? `${value.url}/commit/${value.revision}` : value)

  static printDate = value => (!value ? null : moment(value).format('YYYY-MM-DD'))

  static printArray = value => (value && isArray(value) ? value.join(', ') : null)

  static getPercentage = (count, total) => Math.round(((count || 0) / total) * 100)

  static isSourceComponent = component => ['github', 'sourcearchive'].includes(component.provider)

  /**
   *  Get image of definition based on the provider
   *
   * @param {*} item
   * @returns image file
   */
  static getImage(item) {
    switch (item.coordinates.provider) {
      case 'github':
        return github
      case 'npmjs':
        return npm
      case 'pypi':
        return pypi
      case 'rubygems':
        return gem
      case 'nuget':
        return nuget
      default:
        return null
    }
  }

  // Function that retrieve informations about facets from the definition
  static foldFacets(definition, facets = null) {
    facets = facets || ['core', 'data', 'dev', 'docs', 'examples', 'tests']
    let files = 0
    let attributionUnknown = 0
    let discoveredUnknown = 0
    let parties = []
    let expressions = []
    let declared = null

    facets.forEach(name => {
      const facet = get(definition, `licensed.facets.${name}`)
      if (!facet) return
      files += facet.files || 0
      attributionUnknown += get(facet, 'attribution.unknown', 0)
      parties = union(parties, get(facet, 'attribution.parties', []))
      discoveredUnknown += get(facet, 'discovered.unknown', 0)
      expressions = union(expressions, get(facet, 'discovered.expressions', []))
      declared = get(definition, `licensed.declared`)
    })

    return {
      coordinates: definition.coordinates,
      described: definition.described,
      licensed: {
        files,
        declared,
        discovered: { expressions, unknown: discoveredUnknown },
        attribution: { parties, unknown: attributionUnknown }
      }
    }
  }

  /**
   * Function that get an url as a string, and return a sourceLocation object according to the definition schema
   * @param {*} value updated url of the definition
   * @returns a new object containing the schema for the sourceLocation
   */
  static parseCoordinates(value) {
    if (!value) return null
    // TODO currently only GitHub is supported. Need a source location picker
    // TODO validate that the URL is good. In the end we need a source picker
    const segments = value.split('/')
    return {
      type: 'git',
      provider: 'github',
      namespace: segments[3],
      name: segments[4],
      url: value,
      revision: segments[6]
    }
  }

  static mergeFacets = value => union(['core'], Object.keys(value))
}
