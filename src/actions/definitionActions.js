// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import map from 'lodash/map'
import chunk from 'lodash/chunk'
import throat from 'throat'
import {
  getDefinitions,
  getDefinition,
  previewDefinition,
  getDefinitionSuggestions,
  getLowScoreDefinitions
} from '../api/clearlyDefined'
import Definition from '../utils/definition'
import { uiBrowseUpdateList, uiInfo, uiDanger } from './ui'
import EntitySpec from '../utils/entitySpec'

export const DEFINITION_LIST = 'DEFINITION_LIST'
export const DEFINITION_BODIES = 'DEFINITION_BODIES'

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

export function revertDefinitionAction(definition, values, name) {
  return (dispatch, getState) => {
    const state = getState()
    const actions = asyncActions(name)
    dispatch(actions.start({ definition, values }))
    const componentsWithoutChanges = Definition.revert(state.ui.browse.componentList.list, definition, values)
    dispatch(uiBrowseUpdateList({ updateAll: componentsWithoutChanges }))
    return dispatch(actions.success({ componentsWithoutChanges }))
  }
}

export function browseDefinitionsAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getLowScoreDefinitions(token, entity).then(
      result => {
        dispatch(actions.success({ add: result }))
        const toAdd = map(result, component => EntitySpec.validateAndCreate(component.coordinates)).filter(e => e)
        dispatch(uiBrowseUpdateList({ updateAll: toAdd }))
        const chunks = chunk(map(toAdd, component => EntitySpec.fromCoordinates(component).toPath(), 100))
        Promise.all(chunks.map(throat(10, chunk => dispatch(getDefinitionsAction(token, chunk)))))
          .then(() => uiInfo(dispatch, 'All components have been loaded'))
          .catch(() => uiDanger(dispatch, 'There was an issue retrieving components'))
      },
      error => dispatch(actions.error(error))
    )
  }
}
