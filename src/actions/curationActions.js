// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { curate, getCuration } from '../api/clearlyDefined'
import { uiNotificationNew } from '../actions/ui'

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

export function curateAction(token, spec) {
  return dispatch => {
    const actions = asyncActions(CURATION_POST)
    dispatch(actions.start())
    dispatch(uiNotificationNew({ type: 'info', message: 'Started contribution.', timeout: 5000 }))
    return curate(token, spec).then(
      result => {
        dispatch(actions.success(result))
        dispatch(
          uiNotificationNew({ type: 'info', message: `Successfully contributed PR#${result.prNumber}.`, timeout: 5000 })
        )
      },
      error => {
        dispatch(actions.error(error))
        dispatch(uiNotificationNew({ type: 'info', message: 'Failed contribution.', timeout: 5000 }))
      }
    )
  }
}
