// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getPrcomponents } from '../api/clearlyDefined'

export function getPrComponentsAction(token, entity, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getPrcomponents(token, entity)
      .then(result => dispatch(actions.success(result)))
      .catch(error => dispatch(actions.error(error)))
  }
}
