// Copyright (c) Microsoft Corporation and others. Made available under the MIT license.
// SPDX-License-Identifier: MIT

import { ROUTE_ROOT } from '../utils/routingConstants'
import { uiRedirect } from './ui'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export function login(token, permissions) {
  return (dispatch) => dispatch({ type: LOGIN, token, permissions })
}

export function logout(error) {
  return (dispatch) => {
    dispatch({ type: LOGOUT, error })
    dispatch(uiRedirect(ROUTE_ROOT))
  }
}
