// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { LOGIN, LOGOUT } from '../actions/sessionActions'

const initialState = {
  isAnonymous: true,
  token: null,
  isFetching: false
}

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAnonymous: false,
        token: action.token,
        permissions: action.permissions
      }
    case LOGOUT:
      return { ...initialState }
    default:
      return state
  }
}