// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getStats } from '../api/clearlyDefined'

export const STATS_GET = 'STATS_GET'

export function getStatAction(type) {
  return dispatch => {
    const actions = asyncActions(STATS_GET)
    dispatch(actions.start())
    return getStats(type).then(
      result => dispatch(actions.success({ add: { [type]: result } })),
      error => dispatch(actions.error(error))
    )
  }
}
