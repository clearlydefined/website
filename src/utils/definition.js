import Contribution from './contribution'
import EntitySpec from './entitySpec'

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
    if (!definition.described) return null
    const tool = Math.ceil((definition.described.toolScore + definition.licensed.toolScore) / 2)
    const effective = Math.ceil((definition.described.score + definition.licensed.score) / 2)
    return { tool, effective }
  }
}
