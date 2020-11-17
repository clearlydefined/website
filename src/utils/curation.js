// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import { difference } from './utils'
import EntitySpec from './entitySpec'

/**
 * Abstract methods for Curation
 *
 */
export default class Curation {
  /**
   * Returns appliable suggestions, comparing the latest curation with the current curation of the definition
   * If one ore more suggestions are already applied, then they wont be considered
   * @param  {} latestCuration
   * @param  {} currentCuration
   * @param  {} appliedSuggestions
   */
  static getSuggestions(latestCuration, currentCuration, appliedSuggestions) {
    if (!latestCuration || !currentCuration) return
    if (!isEmpty(appliedSuggestions)) return omit(difference(latestCuration, currentCuration), appliedSuggestions)
    return difference(latestCuration, currentCuration)
  }

  static getValue(component, field) {
    return get(component, field) || ''
  }

  static isCurated(curation, definition) {
    const contributions = get(curation, 'contributions')
    if (!contributions) return false
    const coordinatesWithoutRevision = EntitySpec.withoutRevision(definition.coordinates)
    const { revision } = definition.coordinates

    const definitionContributions = contributions.filter(contribution => {
      const matchingCoordinates = contribution.files.filter(file => {
        return JSON.stringify(file.coordinates) === JSON.stringify(coordinatesWithoutRevision).toLowerCase()
      })
      const res = matchingCoordinates.find(file => {
        return file.revisions.find(fileRevision => fileRevision.revision === revision) !== undefined
      })

      return res
    })

    return !!definitionContributions.filter(Curation.isMerged).length
  }

  static isPending(curation) {
    const contributions = get(curation, 'contributions')
    if (!contributions) return false
    return !!contributions.filter(Curation.isOpen).length
  }

  static isMerged(contribution) {
    return get(contribution, 'pr.state') === 'closed' && get(contribution, 'pr.merged_at')
  }

  static isOpen(contribution) {
    return get(contribution, 'pr.state') === 'open'
  }
}
