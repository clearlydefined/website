// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { LOGIN, LOGOUT } from '../actions/sessionActions'

const initialState = {
  isAnonymous: true,
  token: null,
  isFetching: false,
  username: null
}

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAnonymous: false,
        token: action.token,
        permissions: action.permissions,
        username: action.username
      }
    case LOGOUT:
      return { ...initialState }
    default:
      return state
  }
}
