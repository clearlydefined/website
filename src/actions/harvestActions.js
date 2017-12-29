// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { harvest } from '../api/clearlyDefined'

export const HARVEST_POST = 'HARVEST_POST'

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
