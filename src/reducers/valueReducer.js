// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

const initialState = null

export default (name = '') => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || (action.type !== name))
      return state

    const { result, error, context } = action
    if (context && context.clear)
      return initialState
 
    if (result && result.deleted)
      return initialState

    if (!(result || error))
      return state

    if (error)
      return state

    if (result) 
      return result
  }
}
