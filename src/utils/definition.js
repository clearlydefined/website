import Contribution from './contribution'
import EntitySpec from './entitySpec'
import { get } from 'lodash'

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
   * Determine if a component doesn't have any data. In order to show in the UI in the list of Components
   *
   * @param {*} definition
   * @returns {boolean}
   */
  static isDefinitionEmpty(definition) {
    return definition.described && definition.described.sourceLocation === undefined
  }
}
