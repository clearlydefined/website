// Copyright (c) Microsoft Corporation.
// SPDX-License-Identifier: MIT

import { ROUTE_ROOT } from '../utils/routingConstants'
import { uiRedirect } from './ui'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export function login(token) {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      token,
    })
  }
}

export function logout(error) {
  return (dispatch) => {
    dispatch({ type: LOGOUT, error })
    dispatch(uiRedirect(ROUTE_ROOT))
  }
}
