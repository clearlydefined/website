// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { curate, getCuration } from '../api/clearlyDefined'

export const CURATION_POST = 'CURATION_POST'
export const CURATION_GET = 'CURATION_GET'
export const CURATION_GET_PROPOSED = 'CURATION_GET_PROPOSED'

export function getCurationAction(token, entity) {
  return (dispatch) => {
    const actions = asyncActions(entity.pr ? CURATION_GET_PROPOSED: CURATION_GET)
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
