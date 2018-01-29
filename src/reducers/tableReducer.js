// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import { merge, omit, keys } from 'lodash'

export default (name = '', keyGenerator = Object.toString) => {
  return (state = {}, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || (action.type !== name))
      return state

    if (action.context && action.context.clear)
      return {}

    const { result, error } = action

    if (!(result || error))
      return state

    if (error) {
      // TODO figure out what to do here with errors filling the table...
      return state
    }

    if (result.remove) {
      return omit(state, keys(result.remove))
    }

    if (result.add) {
      return merge({}, state, result.add)
    }

    if (result.update) {
      return merge({}, state, result.add)
    }

    throw new Error('Invalid action format in TableReducer')
  }
}