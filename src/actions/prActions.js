// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getPrcomponents, getDefinition } from '../api/clearlyDefined'
import EntitySpec from '../utils/entitySpec'

export function getPrComponentsAction(token, pr_number, name) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getPrcomponents(token, pr_number)
      .then(components =>
        Promise.all(
          components.map(component =>
            Promise.all([
              getDefinition(token, EntitySpec.fromPath(`${component}/pr/${pr_number}`)),
              getDefinition(token, EntitySpec.fromPath(`${component}`))
            ]).then(([proposed, current]) => ({ proposed, current, path: component }))
          )
        )
      )
      .then(result => dispatch(actions.success(result)))
      .catch(error => dispatch(actions.error(error)))
  }
}
