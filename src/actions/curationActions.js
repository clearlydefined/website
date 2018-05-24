// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { curate, getCuration, curateAll } from '../api/clearlyDefined'

export const CURATION_POST = 'CURATION_POST'

export function getCurationAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getCuration(token, entity).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function curateAction(token, entity, spec) {
  return dispatch => {
    const actions = asyncActions(CURATION_POST)
    dispatch(actions.start())
    return curate(token, entity, spec).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function curateActionAll(token, spec) {
  return dispatch => {
    const actions = asyncActions(CURATION_POST)
    dispatch(actions.start())
    return curateAll(token, spec).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}
