// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { LOGIN, LOGOUT } from '../actions/sessionActions'

const initialState = {
  isAnonymous: true,
  token: null,
  isFetching: false
}

function base64(value) {
  return Buffer.from(value).toString('base64')
}

function onLogIn(result, error, context) {
  if (!(result || error))
    return { ...initialState, isFetching: true }
  if (error)
    return { ...initialState }
  return { ...initialState, isAnonymous: false, token: base64(context.user + ":" + context.password) }
}

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return onLogIn(action.result, action.error, action.context)
    case LOGOUT:
      return { ...initialState }
    default:
      return state
  }
}