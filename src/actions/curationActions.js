// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { curate, getCuration } from '../api/clearlyDefined'

export const CURATION_POST = 'CURATION_POST'

export function getCurationAction(token, entity, name) {
  return (dispatch) => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getCuration(token, entity).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function curateAction(token, entity, spec) {
  return (dispatch) => {
    const actions = asyncActions(CURATION_POST)
    dispatch(actions.start())
    return curate(token, entity, spec).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}
