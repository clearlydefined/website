// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import {
  getDefinitions,
  getDefinition,
  previewDefinition,
  getDefinitionSuggestions,
  getSuggestedData,
  searchDefinitions
} from '../api/clearlyDefined'
import Definition from '../utils/definition'
import { uiDefinitionsUpdateList, UI_BROWSE_REVERT, uiBrowseUpdateList } from './ui'
import EntitySpec from '../utils/entitySpec'

export const DEFINITION_LIST = 'DEFINITION_LIST'
export const DEFINITION_BODIES = 'DEFINITION_BODIES'
export const DEFINITION_SUGGESTIONS = 'DEFINITION_SUGGESTIONS'

export function getDefinitionAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getDefinition(token, entity, { expandPrs: true }).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionsAction(token, entities) {
  return dispatch => {
    const actions = asyncActions(DEFINITION_BODIES)
    dispatch(actions.start())
    return getDefinitions(token, entities).then(
      result => dispatch(actions.success({ add: result })),
      error => dispatch(actions.error(error))
    )
  }
}

export function getDefinitionSuggestionsAction(token, prefix, name) {
  return dispatch => {
    if (!prefix) return null
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getDefinitionSuggestions(token, prefix).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function previewDefinitionAction(token, entity, curation, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return previewDefinition(token, entity, curation).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function resetPreviewDefinitionAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return dispatch(actions.success({}))
  }
}

export function revertAction(definition, values, name) {
  return (dispatch, getState) => {
    const state = getState()
    const actions = asyncActions(name)
    dispatch(actions.start({ definition, values }))
    const componentsWithoutChanges = Definition.revert(
      name === UI_BROWSE_REVERT ? state.ui.browse.componentList.list : state.ui.definitions.componentList.list,
      definition,
      values
    )
    dispatch(
      name === UI_BROWSE_REVERT
        ? uiBrowseUpdateList({ updateAll: componentsWithoutChanges })
        : uiDefinitionsUpdateList({ updateAll: componentsWithoutChanges })
    )
    return dispatch(actions.success({ componentsWithoutChanges }))
  }
}

export function getDefinitionSuggestedDataAction(token, prefix) {
  return dispatch => {
    if (!prefix) return null
    const actions = asyncActions(DEFINITION_SUGGESTIONS)
    dispatch(actions.start())
    return getSuggestedData(token, prefix).then(
      result => dispatch(actions.success({ add: { [EntitySpec.fromObject(result.coordinates).toPath()]: result } })),
      error => dispatch(actions.error(error))
    )
  }
}

export function browseDefinitionsAction(token, query, name) {
  return async dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    try {
      const result = await searchDefinitions(token, query)
      const definitionBodies = result.data.reduce((result, definition) => {
        const coordinates = EntitySpec.validateAndCreate(definition.coordinates)
        if (coordinates) result[coordinates] = definition
        return result
      }, {})
      const allCoordinates = Object.keys(definitionBodies).map(EntitySpec.fromPath)
      if (query.continuationToken) dispatch(actions.success({ addAll: allCoordinates, data: result.continuationToken }))
      else dispatch(actions.success({ updateAll: allCoordinates, data: result.continuationToken }))

      const definitionActions = asyncActions(DEFINITION_BODIES)
      dispatch(definitionActions.success({ add: definitionBodies }))
    } catch (error) {
      dispatch(actions.error(error))
    }
  }
}
