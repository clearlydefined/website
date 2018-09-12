// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import { merge, omit, keys } from 'lodash'

const initialState = {
  sequence: 0,
  entries: {}
}

export default (name = '', keyGenerator = Object.toString) => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || action.type !== name) return state

    if (action.context && action.context.clear) return initialState

    const { result, error } = action

    if (!(result || error)) return state

    if (error) {
      // TODO figure out what to do here with errors filling the table...
      return state
    }

    if (result.remove) {
      return {
        sequence: state.sequence + 1,
        entries: omit(state.entries, keys(result.remove))
      }
    }

    if (result.add) {
      return {
        sequence: state.sequence + 1,
        entries: merge({}, state.entries, result.add)
      }
    }

    if (result.update) {
      return {
        sequence: state.sequence + 1,
        entries: merge({}, state.entries, result.add)
      }
    }

    throw new Error('Invalid action format in TableReducer')
  }
}
