// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getContributionData, getDefinition } from '../api/clearlyDefined'
import EntitySpec from '../utils/entitySpec'
import { uiContributionUpdateList, uiContributionDefinitions, UI_CONTRIBUTION_GET_URL } from './ui'

export function getPrDataAction(token, prNumber) {
  return dispatch => {
    const actions = asyncActions(UI_CONTRIBUTION_GET_URL)
    dispatch(actions.start())
    return getContributionData(token, prNumber)
      .then(({ changes, url }) => {
        dispatch(actions.success(url))
        return Promise.all(
          changes.map(component =>
            Promise.all([
              getDefinition(token, EntitySpec.fromPath(`${component}/pr/${prNumber}`)),
              getDefinition(token, EntitySpec.fromPath(`${component}`))
            ]).then(([proposed, current]) => ({
              proposed,
              current,
              path: component,
              component: EntitySpec.fromPath(`${component}/pr/${prNumber}`)
            }))
          )
        )
      })
      .then(result => {
        result.forEach(x => dispatch(uiContributionUpdateList({ add: x.component })))
        const table = {}
        result.forEach(x => {
          table[x.component.toPath()] = {
            ...x.proposed,
            coordinates: x.component,
            otherDefinition: x.current
          }
        })
        dispatch(uiContributionDefinitions({ add: table }))
      })
      .catch(error => dispatch(actions.error(error)))
  }
}
