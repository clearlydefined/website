// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { getPackage, previewPackage, getPackageList } from '../api/clearlyDefined'

export const PACKAGE_GET = 'PACKAGE_GET'
export const PACKAGE_GET_PROPOSED = 'PACKAGE_GET_PROPOSED'
export const PACKAGE_PREVIEW = 'PACKAGE_PREVIEW'
export const PACKAGE_LIST = 'PACKAGE_LIST'

export function getPackageAction(token, entity) {
  return (dispatch) => {
    const actions = asyncActions(entity.pr ? PACKAGE_GET_PROPOSED: PACKAGE_GET)
    dispatch(actions.start())
    return getPackage(token, entity).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function getPackageListAction(token, prefix) {
  return (dispatch) => {
    const actions = asyncActions(PACKAGE_LIST)
    dispatch(actions.start())
    return getPackageList(token, prefix).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}

export function previewPackageAction(token, entity, curation) {
  return (dispatch) => {
    const actions = asyncActions(PACKAGE_PREVIEW)
    dispatch(actions.start())
    return previewPackage(token, entity, curation).then(
      result => dispatch(actions.success(result)),
      error => dispatch(actions.error(error))
    )
  }
}
