// Copyright (c) Microsoft Corporation. All rights reserved.
// SPDX-License-Identifier: MIT

import * as _ from 'lodash'

export const initialState = {
  isFetching: false,
  list: [],
  filter: null,
  error: null,
  hasMore: false,
  headers: null,
  data: null
}

const remove = (list, item) => {
  return list ? _.filter(list, (element) => {return element.id !== item.id } ) : list
}

const add = (list, item) => {
  return list ? [...list, item] : list
}

export default (name = '') => {
  return (state = initialState, action) => {
    // if there is a group on the action then it must match this reducer's name
    // otherwise the action type must match the name
    if ((action.group && action.group !== name) || (action.type !== name))
      return state

    if (action.context && action.context.clear) {
      return {
        ...initialState
      }
    }

    const filter = action.context ? action.context.filter : null
    const append = action.context ? action.context.append : false
    const { result, error } = action

    if (!(result || error)) {
      return {
        ...state,
        filter: filter,
        isFetching: true
      }
    }

    if (error) {
      return {
        ...state,
        isFetching: false,
        hasMore: false,
        error: error,
        filter: filter,
        list: []
      }
    }

    if (result.add) {
      return {
        ...state,
        list: add(state.list, result.add)
      }
    }

    if (result.remove) {
      return {
        ...state,
        list: remove(state.list, result.remove)
      }
    }

    if (result) {
      return {
        ...state,
        isFetching: false,
        filter: filter,
        list: (append ? state.list.concat(result.list) : result.list),
        hasMore: result.hasMore,
        headers: result.headers
      }
    }
  }
}