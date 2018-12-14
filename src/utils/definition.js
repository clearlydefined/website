// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import Contribution from './contribution'
import EntitySpec from './entitySpec'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import union from 'lodash/union'

// Abstract methods for Definition
export default class Definition {
  static getPathFromUrl(props) {
    return props.path ? props.path : props.location ? props.location.pathname.slice(props.match.url.length + 1) : null
  }

  static getDefinitionPreview(state) {
    return !state.ui.curate.previewDefinition.isFetching
      ? Contribution.getChangesFromPreview(
          Object.assign({}, state.ui.inspect.definition.item),
          Object.assign({}, state.ui.curate.previewDefinition.item)
        )
      : {}
  }

  static getDefinitionEntity(path) {
    return path ? EntitySpec.fromPath(path) : null
  }

  static computeScores(definition) {
    if (!get(definition, 'described')) return null
    const tool = Math.ceil(
      (get(definition, 'described.toolScore.total', 0) + get(definition, 'licensed.toolScore.total', 0)) / 2
    )
    const effective = Math.ceil(
      (get(definition, 'described.score.total', 0) + get(definition, 'licensed.score.total', 0)) / 2
    )
    return { tool, effective }
  }

  /**
   * Determine if a component doesn't have any data. In order to show in the UI in the list of Components
   *
   * @param {*} definition
   * @returns {boolean}
   */
  static isDefinitionEmpty(definition) {
    return isEmpty(get(definition, 'described.tools'))
  }

  static isSourceEmpty(definition) {
    return !get(definition, 'described.sourceLocation')
  }

  /**
   * Revert a list of definitions or a specific one, removing all the changes or only specific values
   * @param  {[]} components list of definitions
   * @param  {{}} definition specific definition, if null the function will check all the components
   * @param  {string} key string that identifies the specific value to revert, if null all the changes will be removed
   */
  static revert(components, definition, key) {
    if (!components) return
    return components.map(component => {
      if (definition && !isEqual(EntitySpec.fromCoordinates(definition), EntitySpec.fromCoordinates(component)))
        return component
      return this.revertChanges(component, key)
    })
  }

  static revertChanges(component, key) {
    if (!key) {
      const { changes, ...updatedChanges } = component
      return updatedChanges
    }
    const { [key]: omit, ...updatedChanges } = component.changes
    return { ...component, changes: updatedChanges }
  }

  static isCurated(definition) {
    return !isEmpty(get(definition, '_meta.merged'))
  }

  static hasPendingCurations(definition) {
    return !isEmpty(get(definition, '_meta.pending'))
  }

  /**
   * Return a list of PRs sorted by PR number
   * @param {*} definition
   */
  static getPrs(definition) {
    if (!get(definition, '_meta')) return
    const { pending, merged } = get(definition, '_meta')
    return union(
      pending &&
        pending.map(item => {
          return { ...item, status: 'pending' }
        }),
      merged &&
        merged.map(item => {
          return { ...item, status: 'merged' }
        })
    )
  }

  static getRevisionToKey(revision, definition) {
    return definition.provider === 'github' ? revision.sha : revision
  }

  static getRevisionToString(revision, definition) {
    return definition.provider === 'github'
      ? revision.tag === revision.sha
        ? revision.sha
        : `${revision.tag} (${revision.sha})`
      : revision
  }
}
