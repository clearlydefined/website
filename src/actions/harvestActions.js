// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { harvest, getHarvestResults } from '../api/clearlyDefined'

export const HARVEST_POST = 'HARVEST_POST'
export const HARVEST_GET = 'HARVEST_GET'

export function harvestAction(token, spec) {
  return (dispatch) => {
    const actions = asyncActions(HARVEST_POST)
    dispatch(actions.start())
    return harvest(token, spec).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function getHarvestResultsAction(token, entity) {
  return (dispatch) => {
    const actions = asyncActions(HARVEST_GET)
    dispatch(actions.start())
    return getHarvestResults(token, entity).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}
