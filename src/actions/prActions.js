// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getPrcomponents, getDefinition, getCurationBaseUrl } from '../api/clearlyDefined'
import EntitySpec from '../utils/entitySpec'
import { uiViewPrUpdateList, uiViewPrDefinitions } from './ui'

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
            ]).then(([proposed, current]) => ({
              proposed,
              current,
              path: component,
              component: EntitySpec.fromPath(`${component}/pr/${pr_number}`)
            }))
          )
        )
      )
      .then(result => {
        dispatch(actions.success(result))
        result.forEach(x => dispatch(uiViewPrUpdateList({ add: x.component })))
        const table = {}
        result.forEach(x => {
          table[x.component.toPath()] = Object.assign({}, x.proposed, {
            coordinates: x.component,
            otherDefinition: x.current
          })
        })
        dispatch(uiViewPrDefinitions({ add: table }))
      })
      .catch(error => dispatch(actions.error(error)))
  }
}

export function getCurationBaseUrlAction(name) {
  return dispatch => {
    const actions = asyncActions(name)
    getCurationBaseUrl().then(result => dispatch(actions.success(result)))
  }
}
