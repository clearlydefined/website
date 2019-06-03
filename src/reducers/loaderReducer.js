// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT
import get from 'lodash/get'

const initialState = {
  isLoading: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'UI_INSPECT_GET_CURATIONS':
    case 'UI_INSPECT_GET_DEFINITION':
    case 'UI_INSPECT_GET_HARVESTED':
      let isLoading = state.isLoading
      if (!get(action, 'error') && !get(action, 'result')) isLoading++
      else isLoading--
      return { ...state, isLoading }
    default:
      return state
  }
}

export function getLoadingStatus(state) {
  return state.loader.isLoading > 0
}
