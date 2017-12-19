// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { asyncActions } from './'
import { ROUTE_ROOT } from '../utils/routingConstants'
import { checkPassword } from '../api/clearlyDefined'
import { uiRedirect } from './ui'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export function login(user, password) {
  return (dispatch) => {
    const actions = asyncActions(LOGIN)
    dispatch(actions.start())
    return checkPassword(user, password).then(
      result => { dispatch(actions.success(result, { user, password })) },
      error => dispatch(actions.error(error))
    )
  }
}

export function logout(error) {
  return (dispatch) => {
    dispatch({ type: LOGOUT, error })
    dispatch(uiRedirect(ROUTE_ROOT))
  }
}
