import Contribution from './contribution'
import EntitySpec from './entitySpec'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

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
    const tool = Math.ceil((get(definition, 'described.toolScore', 0) + get(definition, 'licensed.toolScore', 0)) / 2)
    const effective = Math.ceil((get(definition, 'described.score', 0) + get(definition, 'licensed.score', 0)) / 2)
    return { tool, effective }
  }

  /**
   * Revert a list of definitions or a specific one, removing all the changes or only specific values
   * @param  {[]} components list of definitions
   * @param  {{}} definition specific definition, if null the function will check all the definitions
   * @param  {string} value string that identifies the specific value to revert, if null all the changes will be removed
   */
  static revert(components, definition, value) {
    if (!components) return
    return components.map(component => {
      const withoutChanges = this.revertChanges(component, value)
      if (!definition) return withoutChanges
      else if (isEqual(EntitySpec.fromCoordinates(definition), EntitySpec.fromCoordinates(component)))
        return withoutChanges
      else return component
    })
  }

  static revertChanges(component, value) {
    if (value) {
      const { [value]: omit, ...withoutChanges } = component.changes
      component.changes = withoutChanges
      return component
    } else {
      const { changes, ...withoutChanges } = component
      return withoutChanges
    }
  }
}
