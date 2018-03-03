// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const initialState = {
  isFetching: false,
  isFetched: false,
  item: null,
  transformed: null,
  error: null,
  headers: null,
  deleted: false
}

export default (name = '', itemTransformer = null, itemName = 'item') => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || action.type !== name) return state

    const { result, error, context } = action
    if (context && context.clear) {
      return {
        ...initialState
      }
    }

    if (result && result.deleted) {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        error: false,
        deleted: true
      }
    }

    if (!(result || error)) {
      return { ...state, isFetching: true, isFetched: false, deleted: false }
    }

    if (error) {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        error: error,
        item: null,
        transformed: null,
        deleted: false
      }
    }

    if (result) {
      const transformed = itemTransformer ? itemTransformer(result) : null
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        deleted: false,
        [itemName]: result,
        transformed,
        headers: result.headers
      }
    }
  }
}
