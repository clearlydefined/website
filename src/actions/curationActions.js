// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import flatten from 'lodash/flatten'

import { asyncActions } from './'
import { curate, getCuration, getCurationList, getCurationData } from '../api/clearlyDefined'
import { uiNotificationNew, uiGetCurationData } from '../actions/ui'

export const CURATION_POST = 'CURATION_POST'
export const CURATION_BODIES = 'CURATION_BODIES'

export function getCurationAction(token, entity) {
  return dispatch => {
    const actions = asyncActions(CURATION_BODIES)
    dispatch(actions.start())
    return getCuration(token, entity, { expandedPrs: true }).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

/**
 * List all of the curations (if any) using the given coordinates as a pattern to match
 * @param  {} token
 * @param  {} entity
 * @param  {} name
 * @param  {} params
 */
export function getCurationListAction(token, entity, name, params) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getCurationList(token, entity, params).then(
      result => {
        dispatch(actions.success(result))
        result && result.length > 0 && dispatch(uiGetCurationData(token, entity, result[0].number))
      },
      error => dispatch(actions.error(error))
    )
  }
}

/**
 * Get the curation in the given PR relative to the specified coordinates
 * @param  {} token
 * @param  {} entity
 */
export function getCurationDataAction(token, entity, name, prNumber) {
  return dispatch => {
    const actions = asyncActions(name)
    dispatch(actions.start())
    return getCurationData(token, entity, prNumber).then(
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
        const prMessage = (
          <div>
            Successfully contributed{' '}
            <a href={result.url} target="_blank">
              PR#
              {result.prNumber}
            </a>
          </div>
        )
        dispatch(actions.success(result))
        dispatch(
          uiNotificationNew({
            type: 'info',
            message: prMessage,
            timeout: 10000
          })
        )
      },
      error => {
        dispatch(actions.error(error))
        if (error.status === 400) {
          const errors = flatten(error.body.errors)
          errors.forEach(e => {
            dispatch(uiNotificationNew({ type: 'danger', message: `Contribution ERROR: ${e.error.message}` }))
          })
        } else dispatch(uiNotificationNew({ type: 'info', message: 'Failed contribution.', timeout: 5000 }))
      }
    )
  }
}
