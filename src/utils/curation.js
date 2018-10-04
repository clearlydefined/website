// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import { difference } from './utils'

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
}
